'use strict';
angular.module('main')
.controller('ToggleCtrl', function ($http, $rootScope, $cordovaDevice, $ionicPush, $scope) {

  $rootScope.locationOn = false;
  $scope.token = false;

  this.toggleLocation = function () {
    if (!$scope.token) {
      $ionicPush.register().then(function(t) {
        $scope.token = t.token;
        return $ionicPush.saveToken(t);
      });
    }
    $scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      alert(msg.title + ': ' + msg.text);
    });

    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
      $rootScope.$on('rootScope:location', function (event, data) {
        data.token = $scope.token;
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
