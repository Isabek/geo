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
  this.route('geo-portal');
});

Router.plugin('ensureSignedIn');
