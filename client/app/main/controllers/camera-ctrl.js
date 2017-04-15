'use strict';
angular.module('main')
.controller('CameraCtrl', function ($scope, $cordovaCamera) {
  $scope.takePhoto = function () {
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
    }, function (err) {
      console.error(err);
    });
  };
});
