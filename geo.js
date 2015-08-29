var Places = new Mongo.Collection('places');

if (Meteor.isClient) {
  Meteor.startup(function () {
    GoogleMaps.load();
  });


  var checkedPlaceTypes = [], markers = [], placeName = null;

  Template.filterPlaces.events({
    'change .checkbox input': function (event) {
      var value = event.target.value;
      var index = checkedPlaceTypes.indexOf(value);
      if (index > -1) checkedPlaceTypes.splice(index, 1);
      else checkedPlaceTypes.push(value);

      filterPlaces(checkedPlaceTypes, placeName);

    },
    "blur input:text": function (event) {
      placeName = event.target.value;
      filterPlaces(checkedPlaceTypes, placeName);
    }
  });

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function filterPlaces(placeTypes, placeName) {

    var criteria = {};
    if (placeTypes.length) criteria['type'] = {$in: placeTypes};
    if (placeName) criteria["name"] = new RegExp(placeName, "i");
    setMapOnAll(null);

    markers = [];

    Places.find(criteria).map(function (place) {
      var marker = new google.maps.Marker({
        map: GoogleMaps.maps.placesLocationMap.instance,
        icon: {
          path: fontawesome.markers[findPlaceTypeOptionByValue(place.type).icon],
          scale: 0.4,
          strokeWeight: 0.5,
          strokeColor: 'black',
          strokeOpacity: 1,
          fillColor: '#f8ae5f',
          fillOpacity: 1
        },
        draggable: false,
        position: new google.maps.LatLng(place.location.lat, place.location.lng)
      });

      markers.push(marker);
    });

  }

  Template.geoPortal.helpers({
    placesLocationMapOptions: function () {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(42.87244164855117, 74.58446502685547),
          zoom: 13,
          panControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false
        };
      }
    }
  });

  Template.geoPortal.onCreated(function () {
    GoogleMaps.ready('placesLocationMap', function (map) {
      Places.find().map(function (place) {
        var marker = new google.maps.Marker({
          map: map.instance,
          draggable: false,
          icon: {
            path: fontawesome.markers[findPlaceTypeOptionByValue(place.type).icon],
            scale: 0.4,
            strokeWeight: 0.5,
            strokeColor: 'black',
            strokeOpacity: 1,
            fillColor: '#f8ae5f',
            fillOpacity: 1
          },
          position: new google.maps.LatLng(place.location.lat, place.location.lng)
        });
        markers.push(marker);
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
      {label: "Транспорт", value: 1, icon: "CAR"},
      {label: "Учреждение", value: 2, icon: "UNIVERSITY"},
      {label: "Природа", value: 3, icon: "TREE"},
      {label: "Территория", value: 4, icon: "GLOBE"},
      {label: "Инфраструктура", value: 5, icon: "BUILDING"},
      {label: "Человек", value: 6, icon: "USER"},
      {label: "Неопределённый", value: 7, icon: "COMPASS"}
    ];
  };

  function findPlaceTypeOptionByValue(value) {
    return placeTypesOptions().reduce(function (acc, curr) {
      if (curr.value == value) return curr;
      return acc;
    }, null);
  }

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
              return findPlaceTypeOptionByValue(value) ? findPlaceTypeOptionByValue(value).label : value;
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
