'use strict';
angular.module('main')
.controller('PopupCtrl',function($scope, $rootScope, $ionicPopup, $ionicPush, $timeout, Location) {

// Triggered on a button click, or some other target
  $scope.showPopup = function() {
    $scope.data = {};


    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.wifi">',
      title: 'Enter Wi-Fi Password',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };

  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Consume Ice Cream',
      template: 'Are you sure you want to eat this ice cream?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.getTargetPhoto = function () {
    if ($rootScope.locationOn === true) {
      $http.get('http://35.162.247.27:4000/target?deviceId=' + $cordovaDevice.getDevice().uuid)
      .success(function(data) {
        console.log('Data from get', data);
        $scope.showAlert(data.username, data.photo);
      })
      .error(function (err) {
        console.log(err);
        $scope.showAlert(data.username, data.photo);
      });

      setTimeout(getAllLocations, 5000);
    }
  };

  // An alert dialog
  $scope.showAlert = function(title, template) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: template
    });

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $rootScope.$on('rootScope:queue', function (event) {
    $scope.showAlert('Added to Queue', 'You will be added to the game when a space becomes available');
  });

  $scope.$on('cloud:push:notification', function(event, data) {
    if (data.message === 'You have a new target') {
      $scope.getTargetPhoto();
      Location.getTargetLocation();
    } else {
      var msg = data.message;
      $scope.showAlert(msg.title, msg.text);
    }
  });

});
