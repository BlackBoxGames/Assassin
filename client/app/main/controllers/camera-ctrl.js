'use strict';
angular.module('main')
.controller('CameraCtrl', function ($scope, $rootScope, $http, $cordovaDevice, $cordovaCamera) {
  $scope.takePhoto = function () {
    if (!$rootScope.loggedIn) {
      $rootScope.$emit('rootScope: toggleFail');
      return;
    }
    if (!$rootScope.hasTarget) {
      $rootScope.$emit('rootScope: cameraNoTarget');
      return;
    }
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
      imageData = 'data:image/jpeg;base64,' + imageData;
      $scope.sendKill(imageData);
    }, function (err) {
      console.error(err);
    });
  };

  $scope.sendKill = function(image) {
    var id = $cordovaDevice.getDevice().uuid;
    var killData = {
      image: image,
      deviceId: id
    };
    $http({
      method: 'POST',
      url: 'http://35.162.247.27:4000/target',
      data: killData
    }).then(function (response) {
      console.log(response);
    }, function (err) {
      console.error(err);
    });
  };
});
