'use strict';
angular.module('main')
.controller('UserCtrl', function ($log, $http) {

  this.user = {
    username: ''
  };
  this.updateResult = function (type, result) {
    $log.log(type, result);
    this.user.resultType = type;
    this.user.result = result;
  };

  // tries to sign the user up and displays the result in the UI
  this.signup = function () {
    $http({
      method: 'PUT',
      url: 'http://localhost:4000/users',
      data: this.user
    }).then(function (response) {
      console.log(response);
    }, function (err) {
      console.error(err);
    });
  };
  // very basic MVP, if user exists it just overwrites, TODO: check first and redirect to signin if user already exists.
  // tries to sign in the user and displays the result in the UI

  this.signin = function() {
    console.log(this.user.username);
    console.log('http://localhost:4000/users?username=' + this.user.username);
    $http({
      method: 'GET',
      url: 'http://localhost:4000/users?username=' + this.user.username
    }).then(function (response) {
      console.log(response);
    }, function (err) {
      console.error(err);
    });
  };
});
