'use strict';
angular.module('main')
.controller('PopupCtrl',function($scope, $rootScope, $ionicPopup, $ionicPush, $timeout, Location) {

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
  $scope.showConfirm = function(message, image) {
    var confirmPopup = $ionicPopup.confirm({
      title: message,
      template: image
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
  $scope.showAlert = function(title, template) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });
    alertPopup.then(function(res) {
      console.log('showAlert');
    });
  };

  $scope.getTargetPhoto = function () {
    if ($rootScope.locationOn === true) {
      var id = $cordovaDevice.getDevice().uuid;
      $http({
        url: 'http://35.162.247.27:4000/target',
        method: 'GET',
        params: {deviceId: id}
      })
      .success(function(data) {
        console.log('Data from get', data);
        $scope.showAlert(data.username, data.image);
        $rootScope.target = data.username;
        $rootScope.image = data.image;
      })
      .error(function (err) {
        console.log(err);
        $scope.showAlert(data.username, data.image);
        $rootScope.target = data.username;
        $rootScope.image = data.image;
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

  $scope.$on('cloud:push:notification', function(event, data) {
    if (data.route === 'newTarget') {
      $scope.showAlert(data.target.username, /*data.target.image*/ 'image');
      $rootScope.target = data.target.username;
      $rootScope.image = data.target.image;
      Location.getTargetLocation();
    } else if (data.route === 'killed') {
      $scope.showConfirm(data.message, data.image);
    } else {
      var msg = data.message;
      Location.getTargetLocation();
      $scope.showAlert(msg.title, msg.text);
      // $scope.getTargetPhoto();
      Location.getTargetLocation();
    }
  });
});
