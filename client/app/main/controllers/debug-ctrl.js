'use strict';
angular.module('main')
.controller('DebugCtrl', function ($log, $http, $timeout, Location, $rootScope, Config, $cordovaDevice, $scope, $ionicPush) {

  $log.log('Hello from your Controller: DebugCtrl in module main:. This is your controller:', this);

  // bind data from services
  this.Location = Location;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;
  // get device info
  ionic.Platform.ready(function () {
    if (ionic.Platform.isWebView()) {
      this.device = $cordovaDevice.getDevice();
    }
    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      console.log('Token saved:', t.token);
    });
  }.bind(this));

  // PASSWORD EXAMPLE
  this.password = {
    input: '', // by user
    strength: ''
  };
  this.grade = function () {
    var size = this.password.input.length;
    if (size > 8) {
      this.password.strength = 'strong';
    } else if (size > 3) {
      this.password.strength = 'medium';
    } else {
      this.password.strength = 'weak';
    }
  };
  this.grade();

  // Proxy
  $scope.proxyState = 'ready';
  this.proxyRequestUrl = Config.ENV.SOME_OTHER_URL + '/get';
  $rootScope.$on('latlngtest', function(event, data) {
    $scope.proxyState = 'Lat: ' + data.lat + 'Lng: ' + data.lng;
  });


  this.proxyTest = function () {
    $rootScope.$on('rootScope:players', function(event, data) {
      $scope.proxyState = data.length;
      console.log(event, data);
    });

    $scope.proxyState = '. . .';
    //$scope.proxyState = '...';
    this.Location.getAllLocations();
  };

  $scope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  });

});
