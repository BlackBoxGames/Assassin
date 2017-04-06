'use strict';
angular.module('main')
.controller('MapCtrl', function ($scope, $state, $cordovaGeolocation) {
  $scope.latLng = {lat: null, lng: null};
  $scope.locations = {};
  // object of other player's locations.  Expecing an object with deviceIds as a key and
  // {lat, lng, deviceId} as a value

  // function to render the map, this should only have to be called once
  // on the first location change
  $scope.renderMap = (zoom, mapTypeId) => {
    var mapOptions = {
      center: $scope.latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //TODO update the mapOptions with params, saved for reference for now
  };

  $scope.renderPoint = point => {
    new google.maps.Point({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: point
    });
  };

});
