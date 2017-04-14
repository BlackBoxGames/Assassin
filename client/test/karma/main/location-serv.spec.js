'use strict';

describe('module: main, service: Location', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var Location;

  beforeEach(inject(function (_Location_) {
    Location = _Location_;
  }));

  // it('should get the location of the connected user', function() {
  //   Location.sendLocation(user);
  //   $httpBackend.expectPOST('/location').respond(201,'');
  //   Location.sendLocation(null);
  //   $httpBackend.expectPOST('/location').respond(404,'invalid data');
  // });

  // it('should update the user\'s location periodically', function() {
  //   $LocationControllerScope.currentLocation = user;
  //   expect(LocationController.sendLocation).to.be.called;
  //   expect(MapController.renderPoint).to.be.called;
  // });

  // it('should get the location of all connected players', function()  {
  //   $httpBackend.expectGET('/location').respond(200, players);
  //   expect($LocationScope.players.length).to.equal(players.length);
  //   expect($LocationScope.players['012'].lat).to.equal(50);
  // });

  // it('should update other player\'s locations periodically', function() {
  //   $LocationControllerScope.players = players;
  //   expect(LocationController.sendLocation).to.be.called;
  //   expect(MapController.renderPoint).to.be.called;
  // });

  // it('all location data for respective player should be cleared from user\'s memory cache when that player disables location', function() {
  //   $LocationController.toggleLocation();
  //   expect($LocationController.players.length).to.not.exist;
  // });

  // players['678'] = null; //simulate player disconnect
  // it('other players disabling or enabling their location should add or remove that player from user\'s map rendering ', function() {
  //   $httpBackend.expectGET('/loc').respond(200, players);
  //   expect(players['678']).to.exist;
  //   expect(players['678'].lon).to.not.exist;
  //   expect(players['length']).to.equal(3);
  // });

});
