'use strict';
angular.module('main')
.controller('PopupCtrl',function($scope, $rootScope, $ionicPopup, $ionicPush, $timeout, Location, $http, $cordovaDevice) {

// Triggered on a button click, or some other target

  // $scope.showPopup = function() {
  //   $scope.data = {};
  //   // An elaborate, custom popup
  //   var myPopup = $ionicPopup.show({
  //     template: '<input type="password" ng-model="data.wifi">',
  //     title: 'Enter Wi-Fi Password',
  //     subTitle: 'Please use normal things',
  //     scope: $scope,
  //     buttons: [
  //       { text: 'Cancel' },
  //       {
  //         text: '<b>Save</b>',
  //         type: 'button-positive',
  //         onTap: function(e) {
  //           if (!$scope.data.wifi) {
  //             //don't allow the user to close unless he enters wifi password
  //             e.preventDefault();
  //           } else {
  //             return $scope.data.wifi;
  //           }
  //         }
  //       }
  //     ]
  //   });
    // myPopup.then(function(res) {
    //   console.log('Tapped!', res);
    // });
  //   $timeout(function() {
  //     myPopup.close(); //close the popup after 3 seconds for some reason
  //   }, 3000);
  // };

  // A confirm dialog
  $scope.showConfirm = function(title, text, image) {
    var imageTemplate = '<center><img ng-src="' + image + '" style="width: 100%; padding: 5px"/></center>' || '';
    var confirmPopup = $ionicPopup.confirm({
      title: title,
      subTitle: text,
      template: imageTemplate
    });
    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  // An alert dialog
  $scope.showAlert = function(title, message) {
    var imageTemplate = '';
    var alertPopup = $ionicPopup.alert({
      title: title,
      subTitle: message,
    });
    alertPopup.then(function(res) {
      console.log(res);
    });
  };

  $scope.getTargetPhoto = function (title, text) {
    if ($rootScope.locationOn === true) {
      var id = $cordovaDevice.getDevice().uuid;
      $http({
        url: 'http://35.162.247.27:4000/target',
        method: 'GET',
        params: {deviceId: id}
      })
      .success(function(data) {
        console.log('Data from get', data);
        if (title === 'Your New Target') {
          $rootScope.target = text;
          $rootScope.mugshot = data;
          Location.getTargetLocation();
          $rootScope.hasTarge = true;
        } else {
          $rootScope.hasTarget = false;
        }
        $scope.showConfirm(title, text, data);
      })
      .error(function (err) {
        console.log(err);
      });
    }
  };

  $rootScope.$on('rootScope:queue', function (event) {
    $scope.showAlert('Added to Queue', 'You will be added to the game when a space becomes available');
  });

  $rootScope.$on('rootScope: toggle', function (event, data) {
    if (!data) {
      $scope.showAlert('Logging Out of the Game', 'You will be logged out in 1 minute. If you log back on in that time you may continue playing.');
    }
  });

  $rootScope.$on('rootScope: logFail', function (event) {
    $scope.showAlert('Login Failed', 'We\'re sorry for the inconvenience. Please try again later.');
  });

  $rootScope.$on('rootScope: toggleFail', function (event) {
    $scope.showAlert('Please Log In', 'You must be signed in to play');
  });

  $rootScope.$on('rootScope: alert', function (event, data) {
    $scope.showAlert(data.title, data.message);
  });

  $rootScope.$on('rootScope: cameraNoTarget', function (event) {
    $scope.showAlert('No Target', 'You must be assigned a target first.');
  });

  $scope.$on('cloud:push:notification', function(event, data) {
    if (data.message.title === 'Victory!') {
      $scope.showAlert(data.message.title, data.message.text);
      $scope.$emit('rootScope:queue');
    } else if (data) {
      $scope.getTargetPhoto(data.message.title, data.message.text);
    } else {
      $scope.showAlert('Ooops', 'There was an error');
    }
  });
});
