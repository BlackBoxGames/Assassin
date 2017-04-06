'use strict';

xdescribe('module: main, controller: MapCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var MapCtrl;
  beforeEach(inject(function ($controller) {
    MapCtrl = $controller('MapCtrl');
  }));

  it('should render the user\'s location to the map', () => {
    MapController.renderPoint(user, 'user');
    expect(MapController.renderPoint).to.be.called;
    MapController.renderPoint(null, null);
    expect(MapController.renderPoint).to.be.called;
  });

  it('should render all player\'s locations on the map', () => {
    for(var player in $LocationScope.players) {
      MapController.renderPoint(player.lon, player.lat);
      expect(Map.Controller.renderPoint).to.be.called;
    }
  });

  it('login toggle works', () => {
    //when button is toggled, state changes
    //server gets notified
  });

  it('disabling user\'s location should remove all players from the map rendering', () => {
    //when logged off no dots should be rendered
  });

  it('all location data should be cleared from memory cache when user disables location', () => {
    //when logged off all data is deallocated
  });

});
