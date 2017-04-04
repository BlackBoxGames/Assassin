var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server'); 
var sinon = require('sinon');

//   beforeEach(() => {
//     //load actual module
//     module('app');

//     var $MapControllerScope = {};
//     var $LocationControlelrScope = {};

//     //create dummy user
//     var user = {'12345': {deviceId: '12345', lon: 25, lat: 25}};

//     //create dummy players
//     var nathan = {
//       deviceId: '012', 
//       lon:50, 
//       lat: 50};
//     var burk = {
//       deviceId: '345',
//       lon:21,
//       lat: 21};
//     var david = {
//       deviceId: '678',
//       lon:22, 
//       lat: 22};
//     var players = {'012': nathan, '345': burk, '678': david, length: 3};
 
//     //inject controllers
//     inject(($controller) => { 
//       $controller('MapController', {$scope: $MapControllerScope});
//       $controller('LocationController', {$scope: $LocationControllerScope});
//     }) 
//   });
 
//   describe('user tests', () => {

//     it('should get the location of the connected user', () => {   
//       LocationController.sendLocation(user);
//       $httpBackend.expectPOST('/loc').respond(201,'');
//       LocationController.sendLocation(null);
//       $httpBackend.expectPOST('/loc').respond(400,'invalid data');
//     });

//     it('should render the user\'s location to the map', => () {
//       MapController.renderPoint(user, 'user');
//       expect(MapController.renderPoint).to.be.called;
//       MapController.renderPoint(null, null);
//       expect(MapController.renderPoint).to.be.called;
//     });

//      it('should update the user\'s location periodically', => () {
//       $LocationControllerScope.currentLocation = user;
//       expect(LocationController.sendLocation).to.be.called;
//       expect(MapController.renderPoint).to.be.called;
//     });
//   }); 

//   describe('player tests', () => {

//     it('should get the location of all connected players', => () {
//       $httpBackend.expectGET('/loc').respond(200, players);
//       expect($LocationScope.players.length).to.equal(players.length);
//       expect($LocationScope.players['012'].lat).to.equal(50);
//     });

//     it('should render all player\'s locations on the map', => () {
//       $LocationScope.players.forEach((player) => {
//         MapController.renderPoint(player.lon, player.lat);
//         expect(Map.Controller.renderPoint).to.be.called;
//       })
//     });

//     it('should update other player\'s locations periodically', => () {
//       $LocationControllerScope.players = players;
//       expect(LocationController.sendLocation).to.be.called;
//       expect(MapController.renderPoint).to.be.called;
//     });
//   });

//   describe('mapController_disableLocation', () => {
//     players.['678'] = null; //simulate player disconnect
//     it('other players disabling or enabling their location should add or remove that player from user\'s map rendering ', => () {
//       $httpBackend.expectGET('/loc').respond(200, players);
//       expect(players['678']).to.exist;
//       expect(players['678'].lon).to.not.exist;
//       expect(players['length']).to.equal(3);
//     });

//     it('all location data for respective player should be cleared from user\'s memory cache when that player disables location', => () {
//       $LocationController.toggleLocation();
//       expect($LocationController.players.length).to.not.exist;
//     });

//     it('login toggle works', => () {

//       //when button is toggled, state changes
//       //server gets notified
//     });

//     it('disabling user\'s location should remove all players from the map rendering', => () {
//       //when logged off no dots should be rendered
//     }); 

//     it('all location data should be cleared from memory cache when user disables location', => () {
//       //when logged off all data is deallocated
//     });
//   });
// })
