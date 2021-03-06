if (Meteor.isClient) {
  Meteor.startup(function () {
    GoogleMaps.load();
  });


  var checkedPlaceTypes = [], markers = [], placeName = null;

  Template.filterPlaces.events({
    'change .checkbox input': function (event) {
      var value = +event.target.value;
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

    var infoWindow = new google.maps.InfoWindow();
    Places.find(criteria).map(function (place) {

      var location = {
        lat: place.location.split(",")[0],
        lng: place.location.split(",")[1]
      };

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
        position: new google.maps.LatLng(location.lat, location.lng)
      });

      google.maps.event.addListener(marker, 'click', function () {
        var content = Blaze.toHTMLWithData(Template.placeInfoWindow, {
          place: place,
          type: findPlaceTypeOptionByValue(place.type).label
        });

        infoWindow.setContent(content);
        infoWindow.open(GoogleMaps.maps.placesLocationMap.instance, marker);
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
          overviewMapControl: false,
          disableDoubleClickZoom: true
        };
      }
    }
  });

  Template.geoPortal.onCreated(function () {
    GoogleMaps.ready('placesLocationMap', function (map) {

      //map.instance.set("disableDoubleClickZoom", false);

      google.maps.event.addListener(map.instance, "dblclick", function (e) {
        Modal.show('placeAddModal', {data: {location: (e.latLng.lat() + "," +e.latLng.lng())}});

      });

      var infoWindow = new google.maps.InfoWindow();
      Places.find().map(function (place) {

        var location = {
          lat: place.location.split(",")[0],
          lng: place.location.split(",")[1]
        };

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
          position: new google.maps.LatLng(location.lat, location.lng)
        });

        google.maps.event.addListener(marker, 'click', function () {
          var content = Blaze.toHTMLWithData(Template.placeInfoWindow, {
            place: place,
            type: findPlaceTypeOptionByValue(place.type).label
          });

          marker._id = place._id;
          infoWindow.setContent(content);
          infoWindow.open(map.instance, marker);
        });


        markers.push(marker);

        google.maps.event.addListener(marker, "dblclick", function (e) {
          infoWindow.close(map.instance, marker);
          var data = Places.findOne({_id: marker._id});
          Modal.show('placeEditModal', {data: data});
        });

      });
    });
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
          {key: 'description', label: 'Описание'},
          {
            label: "Действия",
            fn: function (value, place) {
              return new Spacebars.SafeString('<a href="' + Router.path('places-edit', {_id: place._id}) + '">Редактировать</a>');
            }
          }
        ]
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
