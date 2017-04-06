'use strict';

describe('module: assassin, service: Assassin', function () {

  // load the service's module
  beforeEach(module('assassin'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Assassin;
  var $timeout;
  beforeEach(inject(function (_Assassin_, _$timeout_) {
    Assassin = _Assassin_;
    $timeout = _$timeout_;
  }));

  describe('.changeBriefly()', function () {
    beforeEach(function () {
      Assassin.changeBriefly();
    });
    it('should briefly change', function () {
      expect(Assassin.someData.binding).toEqual('Yeah this was changed');
      $timeout.flush();
      expect(Assassin.someData.binding).toEqual('Yes! Got that databinding working');
    });
  });

});
