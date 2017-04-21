'use strict';
angular.module('main')
.controller('ToggleCtrl', function ($http, $rootScope, $cordovaDevice, $ionicPush, $scope) {

  $rootScope.locationOn = false;
  $scope.token = false;

  $rootScope.$on('rootScope: image', function(event, data) {
    $scope.image = data;
  });

  this.toggleLocation = function () {
    if (!$rootScope.loggedIn) {
      $rootScope.$emit('rootScope: toggleFail');
      document.getElementById('toggle').checked = false;
      return;
    }
    if (!$scope.token) {
      $ionicPush.register().then(function(t) {
        $scope.token = t.token;
        return $ionicPush.saveToken(t);
      })
      .then(function(t) {
        $scope.token = t.token;
      });
    }

    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
      var listenOnce = $rootScope.$on('rootScope:location', function (event, data) {
        listenOnce();
        data.token = $scope.token;
        data.username = $rootScope.username;
        data.image = $scope.image;
        $http({
          method: 'PUT',
          url: 'http://35.162.247.27:4000/logs/in',
          data: data
        }).then(function (response) {
          $rootScope.$emit('rootScope:queue', null);
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
