'use strict';
angular.module('main')

.controller('UserCtrl', function ($log, $http, $rootScope, $scope, $cordovaCamera) {

  $rootScope.loggedIn = false;
  $scope.announcer = '';
  this.user = {
    username: ''
  };

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
      $rootScope.photo = 'data:image/jpeg;base64,' + imageData;
      $rootScope.$emit('rootScope: photo', $rootScope.photo);
      $scope.signIn();
    }, function (err) {
      console.error(err);
    });
  };

  $scope.signOut = function () {
    $scope.image = undefined;
    $rootScope.photo = undefined;
    $rootScope.loggedIn = false;
    this.user.username = '';
    // $rootScope.$emit('rootScope: photo', $rootScope.photo);
    // $rootScope.$emit('rootScope: login', $rootScope.loggedIn);
  };

  $scope.signIn = function() {
    if (!$scope.image) {
      alert('You must send your photo before the game assigns you a target.');
      return $scope.takePhoto();
    } else {
      $http({
        method: 'PUT',
        url: 'http://35.162.247.27:4000/users',
        data: this.user
      }).then(function (response) {
        $scope.announcer = 'Logged in as ' + this.user.username;
        $rootScope.user = this.user.username;
        $rootScope.loggedIn = true;
        // $rootScope.$emit('rootScope: user', $rootScope.user);
        // $rootScope.$emit('rootScope: photo', $rootScope.photo);
        // $rootScope.$emit('rootScope: login', $rootScope.loggedIn);
      }, function (err) {
        console.error(err);
      });
    }
  };
});
