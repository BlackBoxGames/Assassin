'use strict';
angular.module('main')
.factory('Location', ['$window', function(win) {
  var msgs = [];
  return function(msg) {
    msgs.push(msg);
    if (msgs.length === 3) {
      win.alert(msgs.join('\n'));
      msgs = [];
    }
  };
}]);
