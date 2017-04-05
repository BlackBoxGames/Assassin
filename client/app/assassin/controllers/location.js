angular.module('assassin.location', [])

// Set up controller for location.
.controller('LocationCtrl', function($scope, $http, $cordovaGeolocation) {
  $scope.currentLocation = $cordovaGeolocation.getCurrentPosition()//get coordinates and id from local users phone

}