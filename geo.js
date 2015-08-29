var Places = new Mongo.Collection('places');


FlowRouter.route('/', {
  action: function (params, queryParams) {
    FlowLayout.render('layout', {
      top: "header",
      main: "places"
    });
  },
  name: 'places'
});

FlowRouter.route('/places/add', {
  action: function (params, queryParams) {
    FlowLayout.render('layout', {
      top: "header",
      main: "insertPlaceForm"
    });
  },
  name: 'places-add'
});

FlowRouter.route('/geo-portal', {
  action: function (params, queryParams) {
    FlowLayout.render('layout', {
      top: "header",
      main: "geoPortal"
    });
  },
  name: 'geo-portal'
});

FlowRouter.notFound = {
  action: function () {
    FlowLayout.render('notFoundLayout', {});
  }
};

if (Meteor.isClient) {

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

  var marker = null;

  Meteor.startup(function () {
    GoogleMaps.load();
  });

  Template.map.helpers({
    placeLocationMapOptions: function () {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(42.87244164855117, 74.58446502685547),
          zoom: 13
        };
      }
    }
  });

  Template.map.onCreated(function () {
    GoogleMaps.ready('placeLocationMap', function (map) {

      google.maps.event.addListener(map.instance, 'click', function (event) {

        var markerPosition = event.latLng;
        if (!marker)
          marker = new google.maps.Marker({
            map: map.instance,
            draggable: false
          });

        marker.setPosition(markerPosition);

      });

    });
  });

  Template.places.helpers({
    settings: function () {
      return {
        collection: Places.find(),
        rowsPerPage: 15,
        showFilter: false,
        fields: [
          {key: 'type', label: 'Тип'},
          {key: 'name', label: 'Название'},
          {key: 'dangerLevel', label: 'Уровень опасности'},
          {key: 'description', label: 'Описание'}
        ]
      };
    }
  });

  Template.insertPlaceForm.events({
    "submit form": function (event) {
      event.preventDefault();
      var target = event.target;

      var type = target.type.value;
      var dangerLevel = target.dangerLevel.value;
      var name = target.name.value;
      var description = target.description.value;
      var lat, lng;

      if (marker) {
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
      }

      Places.insert({
        type: type,
        name: name,
        dangerLevel: dangerLevel,
        description: description,
        loc: {
          lat: lat,
          lng: lng
        }
      });

      target.reset();
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
