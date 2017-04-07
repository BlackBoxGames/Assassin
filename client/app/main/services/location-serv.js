'use strict';
angular.module('main')
.factory('Location', function ($rootScope, $http, $cordovaGeolocation/*, $cordovaDevice*/) {

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
    // $http({
    //   method: 'GET',
    //   url: '/locations',
    // }).then(function (response) {
    //   console.log(response);
    //   $rootScope.$emit('rootScope.players', response);
    //   return allPlayers;
    // }, function (err) {
    //   console.error(err);
    // });

    var randomData = {};
    for (var i = 0; i < 10; i++) {
      
    }
    $rootScope.$emit('rootScope.players', randomData);
  };

  //cordova Geolocation functions
  var getUserLocation = function () {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        //var device = $cordovaDevice.getDevice();
        var userLocation = {};
        //userLocation.deviceId = device.uuid;
        userLocation.lat = position.coords.latitude;
        userLocation.lng = position.coords.longitude;
        $rootScope.$emit('rootScope:location', userLocation);
        // sendLocation(userLocation);
      }, function (err) {
        console.error(err);
      });
  };

  var initLocation = function() {
  //if ($rootScope.active) {
    setTimeout(getUserLocation, 3000);
    setTimeout(getAllLocations, 3000);
    setTimeout(initLocation, 3000);
  };

  return {
    getUserLocation: getUserLocation,
    sendLocation: sendLocation,
    getAllLocations: getAllLocations,
    initLocation: initLocation
  };
});
