'use strict';
angular.module('main')
.controller('LocationCtrl', function ($rootScope) {

  $rootScope.locationOn = false;

  this.toggleLocation = function () {
    console.log('click');
    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
    } else {
      $rootScope.locationOn = false;
    }
  };

});
