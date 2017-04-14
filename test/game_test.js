var request = require('supertest');
var express = require('express');
var sinon = require('sinon');
var expect = require('chai').expect;
var app = require('../server/server');
var helper = require('../server/helpers/helperFunctions');
var lobby = require('../server/helpers/lobby');

var User = require('../server/models/user');
var Game = require('../server/models/game');

const second = 1000;
const minute = second * 60;

var tyler = {
    deviceId: '666',
    lng: 666,
    lat: 666
  };

  var ezcheezy = {
    deviceId: 'starcraft2isthebest',
    lng: 2,
    lat: 2
  };

describe('Game managing logic tests', () => {
  var clock;
  beforeEach(function () {
     clock = sinon.useFakeTimers();
     sinon.spy(lobby, 'assignTargets');
   });

  afterEach(function () {
      clock.restore();
      lobby.setGameStatus(false);
      lobby.assignTargets.restore();
      lobby.clearQueue();
  });

  it('Should add user to game when user logs in', done => {
    request(app)
    .put('/logs/in')
    .send(tyler)
    .expect(() => {
      expect(lobby.getQueue().length).to.equal(1)
      Game.findOnePlayer(tyler.deviceId)
      .then(player => {
        expect(player.deviceId).to.equal('666');
      })
      .catch(error => {
        done(error);
      })
    })
    .end(done)
  });

  it('If current number of players in queue is more than or equal to 5, assign targets in 1 minute', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }

    clock.tick(minute);
    expect(lobby.assignTargets.calledOnce).to.equal(true);
    done();
  });

  it('If current number of players in queue is less than 5, assign targets in 5 minute', done => {
    for (var i = 0; i < 3; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }
    clock.tick(5 * minute);
    expect(lobby.assignTargets.calledOnce).to.equal(true);
    done();
  });

  it('If current number of players in queue is equal to 1, wait indefinitely', done => {
    lobby.addToQueue(tyler);
    clock.tick(60 * minute);
    expect(lobby.assignTargets.notCalled).to.equal(true);
    done();
  });

  it('If player is added after timer starts, restart timer', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }

    clock.tick(0.5 * minute);
    lobby.addToQueue(tyler);
    clock.tick(0.5 * minute);
    expect(lobby.assignTargets.notCalled).to.equal(true);
    clock.tick(0.5 * minute);
    expect(lobby.assignTargets.calledOnce).to.equal(true);
    done();
  });

  it('Game should start at the end of the timer and queue should be empty', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }

    clock.tick(minute);
    expect(lobby.getGameStatus()).to.equal(true);
    expect(lobby.getQueue().length).to.equal(0);
    done();
  }); 

  it('If player enters when a game has started, add player to queue', done => {
    lobby.setGameStatus(true);
    request(app)
    .put('/logs/in')
    .send(ezcheezy)
    .expect(() => {
      expect(lobby.getQueue().length).to.equal(1);
    })
    .end(done)
  }); 

  it('Game should end when last target is eliminated', done => {
    helper.getAllPlayers().length = 2;
    lobby.elimatePlayer(tyler);
    expect(lobby.getGameStatus()).to.equal(false);
    done();
  });

});

describe('Assigning target logic tests', () => {
  var clock;
  beforeEach(function () {
     clock = sinon.useFakeTimers();
     sinon.spy(lobby, 'assignTargets');
   });

  afterEach(function () {
      clock.restore();
      lobby.setGameStatus(false);
      lobby.assignTargets.restore();
      lobby.clearQueue();
  });
  
  it('Assign targets to players at start of game', done => {
    //nobody gets the same target
    //nobody gets themself as their target
    //push notification to users
    lobby.setGameStatus(true);
    expect(lobby.assignTargets.calledOnce).to.equal(true);
    done();
  });

  it('After a confirmed elimination, reassign targets', done => {
    //with no queued players
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }
    var expectedTarget = lobby.getPlayers[0].target;
    lobby.elimatePlayer(tyler);
    var callback = sinon.spy();
    var proxy = lobby.assignNewTarget(callback);
    expect(callback.calledOnce).to.equal(true);
    done();
  });

  it('After a confirmed elimination, add queued players', done => {
    lobby.elimatePlayer(tyler);
    expect(lobby.getQueue()).to.equal(0);
    done();
  });

  it('After a confirmed elimination, remove elimated player', done => {
    lobby.elimatePlayer(tyler)
    expect(helper.getAllPlayers()[tyler.deviceId]).to.equal(false);
    done();
  });

});