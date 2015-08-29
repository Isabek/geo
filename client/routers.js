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