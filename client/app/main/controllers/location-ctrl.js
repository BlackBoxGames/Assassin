'use strict';
angular.module('main')
.controller('LocationCtrl', function ($scope, $rootScope) {

  $rootScope.locationOn = false;

  this.toggleLocation = function () {
    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
    } else {
      $rootScope.locationOn = false;
    }
  };

});
