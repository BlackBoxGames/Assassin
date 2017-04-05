'use strict';
angular.module('assassin', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('assassin', {
      url: '/assassin',
      abstract: true,
      templateUrl: 'assassin/templates/tabs.html'
    })
      .state('assassin.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'assassin/templates/list.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('assassin.listDetail', {
        url: '/list/detail',
        views: {
          'tab-list': {
            templateUrl: 'assassin/templates/list-detail.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('assassin.debug', {
        url: '/debug',
        views: {
          'tab-debug': {
            templateUrl: 'assassin/templates/debug.html',
            controller: 'AssassinDebugCtrl as ctrl'
          }
        }
      });
});
