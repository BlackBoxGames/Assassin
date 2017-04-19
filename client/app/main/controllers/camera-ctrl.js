'use strict';
angular.module('main')
.controller('CameraCtrl', function ($scope, $rootScope, $http, $cordovaDevice, $cordovaCamera) {
  $scope.takePhoto = function () {
    if (!$rootScope.loggedIn) {
      alert('You must be signed in to play');
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
      $scope.imgURI = 'data:image/jpeg;base64,' + imageData;
      $scope.sendKill();
    }, function (err) {
      console.error(err);
    });
  };

  $scope.sendKill = function() {
    var killData = {
      image: $scope.imgURI,
      uuid: $cordovaDevice.getDevice()
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
