'use strict';
angular.module('main')
.controller('ToggleCtrl', function ($http, $rootScope, $cordovaDevice) {

  $rootScope.locationOn = false;

  this.toggleLocation = function () {
    console.log('click', !$rootScope.locationOn);
    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
      $rootScope.$on('rootScope:location', function (event, data) {
        $http({
          method: 'PUT',
          url: 'http://35.162.247.27:4000/logs/in',
          data: data
        }).then(function (response) {
          console.log(response);
        }, function (err) {
          console.error(err);
        });
      });
    } else {
      $rootScope.locationOn = false;
      $http({
        method: 'PUT',
        url: 'http://35.162.247.27:4000/logs/out',
        data: {
          deviceId: $cordovaDevice.getDevice().uuid,
          lng: null,
          lat: null
        }
      }).then(function (response) {
        console.log(response);
      }, function (err) {
        console.error(err);
      });
    }
    $rootScope.$emit('rootScope: toggle', $rootScope.locationOn);
  };
});
