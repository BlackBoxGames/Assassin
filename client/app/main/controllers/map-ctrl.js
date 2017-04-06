'use strict';
angular.module('main')
.controller('MapCtrl', function ($scope, $rootScope, $state, $cordovaGeolocation) {
  $scope.latLng = {lat: null, lng: null};
  $scope.locations = {};
  // object of other player's locations.  Expecing an object with deviceIds as a key and
  // {lat, lng, deviceId} as a value

  // function to render the map, this should only have to be called once
  // on the first location change
  $scope.renderMap = function(zoom, mapTypeId) {
    //we need an initial latLng to render the map, so grab the location once
    var options = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(options)
    .then(function(position) {
      $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: $scope.latLng,
        zoom: zoom,
        mapTypeId: mapTypeId
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    })
    .catch(function(error) {
      console.log(error);
    });
    //TODO update the mapOptions with params, saved for reference for now
  };

  $scope.renderPoint = function(point) {
    new google.maps.Point({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: point
    });
  };

  $rootScope.$on('rootScope:emit', function (event, data) {
    console.log(data); // 'Emit!'
  });

  var init = function() {
    $rootScope.$emit('rootScope:emit', 'Emit!'); // $rootScope.$on
    $scope.renderMap(15, google.maps.MapTypeId.ROADMAP);
  };

  init();

});
