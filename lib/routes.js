Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'pageNotFound',
  yieldTemplates: {
    menu: {to: 'menu'},
    footer: {to: 'footer'}
  }
});

Router.map(function () {
  this.route('places', {path: '/'});
  this.route('places-add');
  this.route('places-edit', {
    path: '/places/:_id/edit',
    data: function () {
      return Places.findOne({_id: this.params._id});
    }
  });
  this.route('geo-portal');
});

Router.plugin('ensureSignedIn');
