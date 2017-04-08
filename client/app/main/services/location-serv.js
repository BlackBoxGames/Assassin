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
    $http({
      method: 'GET',
      url: 'http://35.162.247.27:4000/locations',
    }).then(function (response) {
      console.log(response);
      $rootScope.$emit('rootScope.players', response.body);
      return allPlayers;
    }, function (err) {
      console.error(err);
    });

    // var randomData = {};
    // var deviceId = [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10];
    // for (var i = 0; i < 10; i++) {
    //   var lat = Math.random()*0.5 + 30;
    //   var lng = Math.random()*0.5 - 97.5;
    //   randomData[deviceId[i]] = {lat: lat, lng: lng, deviceId: deviceId[i]};
    // }
    // $rootScope.$emit('rootScope:players', randomData);
    setTimeout(getAllLocations, 1000);
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
