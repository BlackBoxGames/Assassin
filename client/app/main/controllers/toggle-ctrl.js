'use strict';
angular.module('main')
.controller('ToggleCtrl', function ($http, $rootScope, $cordovaDevice, $ionicPush, $scope) {

  $rootScope.locationOn = false;
  $scope.token = false;

  $rootScope.$on('rootScope: login', function() {
    if (!$rootScope.loggedIn) {
      document.getElementById('toggle').disabled = 'true';
    } else {
      document.getElementById('toggle').disabled = 'false';
    }
  });

  this.toggleLocation = function () {
    if (!$rootScope.loggedIn) {
      alert('You must be signed in to play');
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
        data.photo = $rootScope.photo;
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
