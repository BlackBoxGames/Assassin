'use strict';
angular.module('main')

.controller('UserCtrl', function ($log, $http, $rootScope, $scope, $cordovaCamera) {

  $rootScope.loggedIn = false;
  $scope.announcer = '';
  this.user = {
    username: ''
  };

  $scope.signin = function() {
    if (!$scope.image) {
      alert('You must take a selfie before the game assigns you a target.');
      return $scope.takeSelfie();
    } else {
      $http({
        method: 'PUT',
        url: 'http://35.162.247.27:4000/users',
        data: this.user
      }).then(function (response) {
        $scope.announcer = 'Logged in as ' + response.data;
        $rootScope.loggedIn = true;
        $rootScope.$emit('rootScope: login', $rootScope.loggedIn);
      }, function (err) {
        console.error(err);
      });
    }
  };
});
