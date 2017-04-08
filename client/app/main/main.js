'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/user');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html'
    })
    .state('main.user', {
      url: '/user',
      views: {
        'tab-user': {
          templateUrl: 'main/templates/user.html',
          controller: 'UserCtrl as ctrl'
        }
      }
    })
    .state('main.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'main/templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('main.debug', {
      url: '/debug',
      views: {
        'tab-debug': {
          templateUrl: 'main/templates/debug.html',
          controller: 'DebugCtrl as ctrl'
        }
      }
    });
})
.run(function(Location) {
  Location.initLocation();
});


