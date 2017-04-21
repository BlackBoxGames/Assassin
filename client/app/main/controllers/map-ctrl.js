'use strict';
angular.module('main')
.controller('MapCtrl', function ($scope, $rootScope, $state, $cordovaGeolocation, Location) {
  $scope.latLng = {lat: null, lng: null};
  $scope.marker = null;
  $scope.players = {};
  $scope.currentLocation = {};

  $rootScope.mugshot = 'main/assets/images/sleepyNate.jpg';
  $rootScope.target = 'Sleepy Nate';

  var infowindow = new google.maps.InfoWindow({
    content:
      '<div id="iw-container">' +
        '<div class="iw-title">' + $rootScope.target + '</div>' +
          '<div class="iw-content">' +
            '<img ng-src="' + $rootScope.mugshot + '"" id="selfie">' +
            '<img src="main/assets/images/poloroid.png">' +
          '</div>' +
        '</div>' +
      '</div>'
  });

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

      $rootScope.$on('rootScope:location', function (event, data) {
        if (event) { //for linter
          $scope.latLng = {lat: data.lat, lng: data.lng, deviceId: data.deviceId};
          $scope.renderPoint($scope.latLng, 'user');
        }
      });

      $rootScope.$on('rootScope:players', function (event, data) {
        $scope.renderAllPlayers(data, 'player');
      });
    })
    .catch(function(error) {
      console.log(error);
    });
    //TODO update the mapOptions with params, saved for reference for now
  };

  $scope.removeAllPoints = function() {
    for (var player in $scope.players) {
      $scope.players[player].setMap(null);
    }
    $scope.players = {};
  };


  $scope.renderAllPlayers = function(players, type) {
    //$scope.removeAllPoints();
    for (var player in players) {
      if (player !== 'length') {
        $scope.renderPoint({lat: players[player].lat, lng: players[player].lng, deviceId: players[player].deviceId}, type);
      }
    }
  };

  $scope.renderPoint = function(point, type) {
    //code to either set a new marker if it doesn't exist or move an already existing one
    var marker;
    var latLng = new google.maps.LatLng(point.lat, point.lng);

    if (!point.lat || !point.lng) {
      $scope.players[point.deviceId].setMap(null);
      $scope.players[point.deviceId] = null;
      return;
    }

    if (type === 'player' && $scope.latLng.deviceId !== point.deviceId && $scope.latLng.deviceId) {
      if (!$scope.players[point.deviceId]) {

        marker = new google.maps.Marker({
          animation: google.maps.Animation.BOUNCE,
          position: latLng
          //icon: 'ggm/pink_MarkerA.png'
        });

        marker.addListener('click', function() {
          infowindow.setContent(
            '<div id="iw-container">' +
              '<div class="iw-title">' + $rootScope.target + '</div>' +
              '<div class="iw-content">' +
                '<img ng-src=' + $rootScope.mugshot + ' id="selfie">' +
                '<img src="main/assets/images/poloroid.png">' +
              '</div>' +
              '</div>' +
            '</div>'
          );
          infowindow.open($scope.map, marker);
        });

        google.maps.event.addListener(map, 'click', function() {
          infowindow.close();
        });

        $scope.players[point.deviceId] = marker;
        $scope.players[point.deviceId].setMap($scope.map);
      } else {
        $scope.players[point.deviceId].setPosition(latLng);
        // interpolatePoint($scope.players[point.deviceId]);
      }
    } else if (type === 'user') {
      //user render code
      if ($scope.marker) {
        $scope.marker.setPosition(latLng);
        // interpolatePoint($scope.marker);
      } else {
        marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: latLng
          //icon: 'ggm/blue_MarkerA.png'
        });

        $scope.marker = marker;
        $scope.marker.setMap($scope.map);
      }
    } else {
      $scope.players[point.deviceId].setIcon('main/assets/images/skull.png');
      $scope.players[point.deviceId].setAnimation(google.maps.Animation.DROP);
    }
  };

  var init = function () {
    cordova.plugins.diagnostic.isLocationAvailable(function(available) {
      if (available) {
        $scope.renderMap(18, google.maps.MapTypeId.ROADMAP);
      } else {
        setTimeout(init, 1000);
      }
    }, function(error) {
      //if there's no location available, try again in a second
      console.error('The following error occured:', error);
    });
  };

  function interpolatePoint (oldPoint) {
    var step = 1;
    var maxSteps = 10;
    var time = 500;
    deltaLat = (latLng.lat - oldPoint.lat) / maxSteps;
    deltaLng = (latLng.lng - oldPoint.lng) / maxSteps;

    while (maxSteps > step) {
      setTimeout(function() {
        oldPoint.setPosition(oldPoint.lat + deltaLat * step, oldPoint.lng + deltaLng * step);
        step++;
      }, time / maxSteps);
    }
    oldPoint.setPosition(latLng);
  }

  $rootScope.$on('rootScope: toggle', function () {
    if ($rootScope.locationOn === true) {
      if (!$scope.map) {
        init();
      }
      Location.initLocation();
    } else {
      $scope.removeAllPoints();
    }
  });

  $scope.$on('cloud:push:notification', function(event, data) {
    if (data.message.title === 'You\'ve Been Killed!') {
      $scope.removeAllPoints();
      $scope.marker.setIcon('main/assets/images/skull.png');
    } else if (data.message.title === 'Your New Target') {
      $scope.renderAllPlayers($scope.players, 'assassinated');
    }
  });
});
