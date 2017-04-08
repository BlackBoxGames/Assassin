'use strict';
angular.module('main')
.factory('Location', function ($rootScope, $http, $cordovaGeolocation, $cordovaDevice) {

  //var allPlayers = {};

  var sendLocation = function (userLocation) {
    $http({
      method: 'PUT',
      url: 'http://35.162.247.27:4000/locations',
      data: userLocation
    }).then(function (response) {
      console.log(response);
    }, function (err) {
      console.error(err);
    });
  };

  var getAllLocations = function () {
    $http.get('http://35.162.247.27:4000/locations')
    .success(function(data) {
      console.log('Data from get', data);
      $rootScope.$emit('rootScope:players', data);
    })
    .error(function (err) {
      console.log(err);
      $rootScope.$emit('rootScope:players', err);
    });
    setTimeout(getAllLocations, 2000);
  };

  //cordova Geolocation functions
  var getUserLocation = function () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var device = $cordovaDevice.getDevice();
        var userLocation = {};
        userLocation.deviceId = device.uuid;
        userLocation.lat = position.coords.latitude;
        userLocation.lng = position.coords.longitude;
        $rootScope.$emit('rootScope:location', userLocation);
        sendLocation(userLocation);
        setTimeout(getUserLocation, 3000);
      }, function (err) {
        console.error(err);
      });
  };

  var initLocation = function() {
  //if ($rootScope.active) {
    getUserLocation();
    getAllLocations();
  };

  return {
    getUserLocation: getUserLocation,
    sendLocation: sendLocation,
    getAllLocations: getAllLocations,
    initLocation: initLocation
  };
});
