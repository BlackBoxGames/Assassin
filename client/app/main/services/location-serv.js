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
      var deviceId = Math.random()*11234546345436345;
      var lat = Math.random()*0.5 + 30;
      var lng = Math.random()*0.5 - 97.5;
      randomData[deviceId] = {lat: lat, lng: lng};
    }
    $rootScope.$emit('rootScope:players', randomData);
    setTimeout(getAllLocations, 10000);
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
