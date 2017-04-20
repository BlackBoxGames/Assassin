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
    if ($rootScope.locationOn === true) {
      $http.get('http://35.162.247.27:4000/locations')
      .success(function(data) {
        console.log('Data from get', data);
        $rootScope.$emit('rootScope:players', data);
      })
      .error(function (err) {
        console.log(err);
        $rootScope.$emit('rootScope:players', err);
      });

      setTimeout(getAllLocations, 5000);
    }
  };

  var getTargetLocation = function () {
    if ($rootScope.locationOn === true) {
      var deviceId = $cordovaDevice.getDevice().uuid;
      alert('Getting target location');
      $http(
        {
          url: 'http://35.162.247.27:4000/locations',
          method: 'GET',
          params: {deviceId: deviceId}
        })
      .success(function(data) {
        console.log('Data from get', data);
        alert('Got data');
        $rootScope.$emit('rootScope:players', data);
      })
      .error(function (err) {
        console.log(err);
        $rootScope.$emit('rootScope:players', err);
      });
      setTimeout(getAllLocations, 5000);
    }
  };

  //cordova Geolocation functions
  var getUserLocation = function () {
    if ($rootScope.locationOn === true) {
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
          setTimeout(getUserLocation, 2500);
        }, function (err) {
          console.error(err);
        });
    }
  };

  var initLocation = function() {
    getUserLocation();
    // getAllLocations();
  };

  return {
    getUserLocation: getUserLocation,
    sendLocation: sendLocation,
    getTargetLocation: getTargetLocation,
    getAllLocations: getAllLocations,
    initLocation: initLocation
  };
});
