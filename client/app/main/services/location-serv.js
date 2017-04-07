'use strict';
angular.module('main')
.factory('Location', function ($rootScope, $http, $cordovaGeolocation, $cordovaDevice) {

  var allPlayers = {};

  var sendLocation = function (userLocation) {
    $http({
      method: 'PUT',
      url: '/locations',
      data: userLocation
    }).then(function (response) {
      console.log(response);
    }, function (err) {
      console.error(err);
    });
  };

  var getAllLocations = function () {
    $http({
      method: 'GET',
      url: '/locations',
    }).then(function (response) {
      console.log(response);
      $rootScope.allPlayers = response;
      allPlayers = response;
      return allPlayers;
    }, function (err) {
      console.error(err);
    });
  };

  //cordova Geolocation functions
  var getUserLocation = function () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (/*position*/) {
      }, function (err) {
        console.error(err);
      });

    var watchOptions = {timeout: 3000, enableHighAccuracy: false};
    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function (err) {
        console.error(err);
      },
      function (position) {
        var device = $cordovaDevice.getDevice();
        var userLocation = {};
        userLocation.deviceId = device.UUID;
        userLocation.position.lat = position.coords.latitude;
        userLocation.position.lng = position.coords.longitude;
        $rootScope.allPlayers[userLocation.deviceId] = userLocation;
        $rootScope.$emit('$rootscope:location', userLocation);
        sendLocation(userLocation);
      }
    );

    $cordovaGeolocation.clearWatch(watch)
    .then(
      function (res) {
        console.log(res);
      },
      function (err) {
        console.error(err);
      }
    );
  };

  return {
    getUserLocation: getUserLocation,
    sendLocation: sendLocation,
    getAllLocations: getAllLocations
  };
});
