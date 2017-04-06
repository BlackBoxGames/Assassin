'use strict';
angular.module('main')
.controller('MapCtrl', function ($scope, $rootScope, $state, $cordovaGeolocation) {
  var nathan = {
    deviceId: '012',
    lat: 30.569,
    lng: -97.54};
  var burk = {
    deviceId: '345',
    lat: 30.069,
    lng: -97.34};
  var david = {
    deviceId: '678',
    lat: 30.369,
    lng: -97.44};
  var players = {'012': nathan, '345': burk, '678': david, length: 3};

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
        mapTypeId: mapTypeId,
        styles: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ]
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      $rootScope.$on('rootScope:location', function (/*event, data*/) {
        $scope.renderPoint($rootScope.location);
      });

      $rootScope.$on('rootScope:players', function (/*event, data*/) {
        $scope.renderAllPlayers(players);
      });

      $rootScope.$emit('rootScope:location', {lat: 30.269, lng: -97.74}); // $rootScope.$on THIS IS FOR TESTING
      $rootScope.$emit('rootScope:players', players); // $rootScope.$on THIS IS FOR TESTING
    })
    .catch(function(error) {
      console.log(error);
    });
    //TODO update the mapOptions with params, saved for reference for now
  };

  $scope.renderAllPlayers = function(players) {
    for (var player in players) {
      if (player !== 'length') {
        $scope.renderPoint({lat: players[player].lat, lng: players[player].lng});
      }
    }
  };

  $scope.renderPoint = function(point) {
    new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: point
    });
  };

  var init = function() {
    $rootScope.location = {lat: 30.269, lng: -97.74};
    $scope.renderMap(18, google.maps.MapTypeId.ROADMAP);
  };

  init();

});
