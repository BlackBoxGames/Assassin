'use strict';

describe('module: assassin, controller: AssassinDebugCtrl', function () {

  // load the controller's module
  beforeEach(module('assassin'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var AssassinDebugCtrl;
  beforeEach(inject(function ($controller) {
    AssassinDebugCtrl = $controller('AssassinDebugCtrl');
  }));

  describe('.grade()', function () {

    it('should classify asd as weak', function () {
      AssassinDebugCtrl.password.input = 'asd';
      AssassinDebugCtrl.grade();
      expect(AssassinDebugCtrl.password.strength).toEqual('weak');
    });

    it('should classify asdf as medium', function () {
      AssassinDebugCtrl.password.input = 'asdf';
      AssassinDebugCtrl.grade();
      expect(AssassinDebugCtrl.password.strength).toEqual('medium');
    });

    it('should classify asdfasdfasdf as strong', function () {
      AssassinDebugCtrl.password.input = 'asdfasdfasdf';
      AssassinDebugCtrl.grade();
      expect(AssassinDebugCtrl.password.strength).toEqual('strong');
    });
  });

});
