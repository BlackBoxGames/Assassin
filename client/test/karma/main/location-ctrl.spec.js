'use strict';

describe('module: main, controller: LocationCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var LocationCtrl;
  beforeEach(inject(function ($controller) {
    LocationCtrl = $controller('LocationCtrl');
  }));

  it('should do something', function () {
    expect(!!LocationCtrl).toBe(true);
  });

});
