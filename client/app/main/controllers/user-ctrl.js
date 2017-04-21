'use strict';
angular.module('main')
.controller('UserCtrl', function ($log, $http, $rootScope, $scope, $cordovaCamera, $cordovaDevice) {

  $rootScope.loggedIn = false;
  $scope.announcer = '';
  $scope.user = {
    username: ''
  };

  $rootScope.$on('rootscope: signinPicture', function (event) {
    $scope.takePhoto();
  });

  $scope.takePhoto = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.image = 'data:image/jpeg;base64,' + imageData;
      $rootScope.$emit('rootScope: image', $scope.image);
      $scope.signIn();
    }, function (err) {
      console.error(err);
    });
  };

  $scope.signOut = function () {
    $scope.image = undefined;
    $rootScope.image = undefined;
    $rootScope.loggedIn = false;
    this.user.username = '';
    $rootScope.$emit('rootScope: login');
  };

  $scope.signIn = function() {
    if (!$scope.image) {
      $rootScope.$emit('rootScope: alert', {title: 'Almost There', message: 'We need you to take a selfie.'});
      return;
    } else
    if ($scope.user.username === '') {
      $rootScope.$emit('rootScope: alert', {title: 'Oops', message: 'You must enter a valid username.'});
    }
    this.user.image = $scope.image;
    this.user.deviceId = $cordovaDevice.getDevice().uuid;
    $http({
      method: 'PUT',
      url: 'http://35.162.247.27:4000/users',
      data: this.user
    }).then(function (response) {
      $scope.announcer = 'Logged in as ' + $scope.user.username;
      $rootScope.username = $scope.user.username;
      $rootScope.loggedIn = true;
      // $rootScope.$emit('rootScope: user', $rootScope.user);
      // $rootScope.$emit('rootScope: photo', $rootScope.photo);
      $rootScope.$emit('rootScope: login');
    }, function (err) {
      $rootScope.$emit('rootScope: logFail');
      console.error(err);
    });
  };
});
