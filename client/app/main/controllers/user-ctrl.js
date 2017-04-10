'use strict';
angular.module('main')
.controller('UserCtrl', function ($log, $http, $scope) {

  $scope.announcer = '';

  this.user = {
    username: ''
  };
  // tries to sign the user up and displays the result in the UI
  this.signup = function () {
    $http({
      method: 'GET',
      url: 'http://localhost:4000/users?username=' + this.user.username
    }).then(function (response) {
      if (response.status === 404) {
        $http({
          method: 'PUT',
          url: 'http://localhost:4000/users',
          data: this.user
        }).then(function (response) {
          console.log(response); //for linter
        }, function (err) {
          console.error(err);
        });
      } else {
        $scope.announcer = 'That username is already taken.';
      }
    });
  };

  this.signin = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:4000/users?username=' + this.user.username
    }).then(function (response) {
      if (response.status === 200) {
        //authenticate the user TODO: add google Auth stuff
        $scope.announcer = 'Logged in as ' + this.user.username;
      } else {
        //Prompt user to create a new account
        $scope.announcer = 'User  does not exist, click the sign up button to create a new account';
        console.log($scope.announcer);
      }
    }, function (err) {
      console.error(err);
    });
  };
});
