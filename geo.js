var Places = new Mongo.Collection('places');

if (Meteor.isClient) {


  Meteor.startup(function () {
    GoogleMaps.load();
  });

  Template.geoPortal.helpers({
    placesLocationMapOptions: function () {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(42.87244164855117, 74.58446502685547),
          zoom: 13
        };
      }
    }
  });

  Template.geoPortal.onCreated(function () {
    GoogleMaps.ready('placesLocationMap', function (map) {

      Places.find().map(function (place) {
        new google.maps.Marker({
          map: map.instance,
          draggable: false,
          position: new google.maps.LatLng(place.location.lat, place.location.lng)
        });
      });

    });
  });

  Template.header.helpers({
    placesUrl: function () {
      return FlowRouter.path("places");
    },
    geoPortalUrl: function () {
      return FlowRouter.path("geo-portal");
    }
  });

  Template.notFoundLayout.helpers({
    placesUrl: function () {
      return FlowRouter.path("places");
    }
  });


  Template.places.helpers({
    placeAddUrl: function () {
      return FlowRouter.path("places-add");
    }
  });

  var placeTypesOptions = function () {
    return [
      {label: "Транспорт", value: 1},
      {label: "Учреждение", value: 2},
      {label: "Природа", value: 3},
      {label: "Территория", value: 4},
      {label: "Инфраструктура", value: 5},
      {label: "Человек", value: 6},
      {label: "Неопределённый", value: 7}
    ];
  };

  Template.registerHelper("placeTypesOptions", placeTypesOptions);

  Template.places.helpers({
    settings: function () {
      return {
        collection: Places.find(),
        rowsPerPage: 15,
        showFilter: false,
        fields: [
          {
            key: 'type',
            label: 'Тип',
            fn: function (value, object) {
              return placeTypesOptions().reduce(function (acc, curr) {
                if (curr.value == value) acc = curr.label;
                return acc;
              }, null);
            }
          },
          {key: 'name', label: 'Название'},
          {key: 'dangerLevel', label: 'Уровень опасности'},
          {key: 'description', label: 'Описание'}
        ]
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    savePlace: function (place) {
      check(place, Schema.place);

      var location = place.location.split(",");

      Places.insert({
        type: place.type,
        name: place.name,
        dangerLevel: place.dangerLevel,
        description: place.description,
        location: {
          lat: location[0],
          lng: location[1]
        }
      });
    }
  });

}
