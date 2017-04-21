'use strict';
angular.module('main')
.controller('CameraCtrl', function ($scope, $rootScope, $http, $cordovaDevice, $cordovaCamera) {
  $scope.takePhoto = function () {
    if (!$rootScope.loggedIn) {
<<<<<<< f768a859d07b51c36717cd7683d38db229ad6ab2
<<<<<<< 6df9574d0d99f0f8a0cf01cfa39a375704cfd878
      $rootScope.$emit('rootScope: toggleFail');
=======
      $rootScope.$emit('rootScope: cameraFail');
>>>>>>> Add rootscope listener and alert for cameraFail if not logged in
=======
      $rootScope.$emit('rootScope: toggleFail');
      return;
    }
    if (!$rootScope.hasTarget) {
      $rootScope.$emit('rootScope: cameraNoTarget');
>>>>>>> Prevent user from accessing camera before having target
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
