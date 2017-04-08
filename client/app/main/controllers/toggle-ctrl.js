'use strict';
angular.module('main')
.controller('ToggleCtrl', function ($rootScope) {

  $rootScope.locationOn = false;

  this.toggleLocation = function () {
    if ($rootScope.locationOn === false) {
      $rootScope.locationOn = true;
    } else {
      $rootScope.locationOn = false;
    }
    console.log('click', $rootScope.locationOn);
  };

});
