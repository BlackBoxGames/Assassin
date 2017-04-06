'use strict';
angular.module('main')
.controller('MapCtrl', function ($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: false};
  var latLng;

  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function () {
      new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    });
  }, function (error) {
    console.log('Could not get location', error);
  });
});
