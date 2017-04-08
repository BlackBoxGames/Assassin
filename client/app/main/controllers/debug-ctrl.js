'use strict';
angular.module('main')
.controller('DebugCtrl', function ($log, $http, $timeout, Location, $rootScope, Config, $cordovaDevice, $scope) {

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

  $rootScope.$on('rootScope:testing', function(event, data) {
    $scope.proxyState = 'testing';
    console.log(event, data);
  });

  // Proxy
  $scope.proxyState = 'ready';
  this.proxyRequestUrl = Config.ENV.SOME_OTHER_URL + '/get';

  this.proxyTest = function () {
    $rootScope.$on('rootScope:players', function(event, data) {
      $scope.proxyState = data.length;
      console.log(event, data);
    });

    $scope.proxyState = '. . .';
    //$scope.proxyState = '...';
    this.Location.getAllLocations();
  };

});
