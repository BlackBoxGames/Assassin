'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router'
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/debug');
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
    });
})
.run(function(Location) {
  console.log('Location Service Ready Loaded from Main.');
  console.log(Location);
});


