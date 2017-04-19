var request = require('supertest');
var express = require('express');
var sinon = require('sinon');
var expect = require('chai').expect;
var app = require('../server/server');
var helper = require('../server/helpers/helperFunctions');
var lobby = require('../server/helpers/lobby');
var db = require('../server/dbConfig');


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

after((done) => {
  db.connectToDb();
  Game.deletePlayer(ezcheezy.deviceId)
  .then(() => {
    return Game.deletePlayer(tyler.deviceId)
    .then(() => {
      var location = helper.getAllPlayers();
      location[tyler.deviceId] = undefined;
      location[ezcheezy.deviceId] = undefined;
      location.length = 3;
      db.disconnectFromDb();
      done();
    })
  })

});

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
      /*Game.findOnePlayer(tyler.deviceId)
      .then(player => {
        expect(player.deviceId).to.equal('666');
      })
      .catch(error => {
        done(error);
      })*/
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
    .end(() => {
      expect(lobby.getQueue().length).to.equal(1);
      done();
    });
    
  }); 

  it('Game should not end when a target is eliminated', done => {
    for (var i = 0; i < 4; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }
    lobby.setGameStatus(true);
    var players = lobby.getPlayers();
    lobby.eliminatePlayer(players[0], players[players[0].target]);
    expect(lobby.getGameStatus()).to.equal(true);
    done();
  });

  it('Game should end when last target is eliminated', done => {
    for (var i = 0; i < 2; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }
    lobby.setGameStatus(true);
    var players = lobby.getPlayers();
    lobby.eliminatePlayer(players[0], players[players[0].target]);
    expect(lobby.getGameStatus()).to.equal(false);
    done();
  });

  it('Should be able to clear queue if player logs out', done => {
    var player = {
      player: 0,
      target: null,
      active: 1,
      deviceId: 0
    };
    lobby.addToQueue(player);
    expect(lobby.getQueue().length).to.equal(1);
    lobby.removeFromQueue(player);
    expect(lobby.getQueue().length).to.equal(0);
    done();
  })

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
      lobby.clearPlayers();
  });
  
  it('Assign targets to players at start of game', done => {
    //nobody gets the same target
    //nobody gets themself as their target
    //push notification to users
    lobby.setGameStatus(true);
    expect(lobby.assignTargets.calledOnce).to.equal(true);
    done();
  });

  it('Assign targets such that nobody gets the same target OR themself as a target', done => {
    for (var j = 0; j < 1000; j++) {
      for (var i = 0; i < 30; i++) {
        lobby.addToQueue({
          player: i,
          target: null,
          active: 1,
          deviceId: i
        });
      }

      lobby.assignTargets();
      var targets = [];
      var players = lobby.getPlayers();
      for (var player in players) {
        expect(players[player].player !== players[player].target).to.equal(true);
        expect(players[player].target === undefined).to.equal(false); //shouldn't ever equal undefined
        expect(targets.includes(players[player].target)).to.equal(false);
        targets.push(players[player].target);
      }
      lobby.clearPlayers();
    }
    
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
    clock.tick(minute);

    var players = lobby.getPlayers();
    var eliminatedTarget = players[0].target
    var newTarget = players[eliminatedTarget].target
    lobby.eliminatePlayer(players[0], players[eliminatedTarget]);
    expect(players[0].target).to.equal(players[newTarget].player);
    done();
  });

  it('After a confirmed elimination, add queued players', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }

    clock.tick(2 * minute);
    
    for (var i = 9; i < 10; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }

    expect(lobby.getQueue().length).to.equal(1);
    
    clock.tick(5 * minute);
    var players = lobby.getPlayers();
    var targets = [];

    lobby.eliminatePlayer(players[0], players[players[0].target]);
    expect(lobby.getQueue().length).to.equal(0);
    for (var player in players) {
      if (players[player] === 'eliminated') {
        continue;
      }
      expect(players[player].player !== players[player].target).to.equal(true);
      expect(players[player].target === undefined).to.equal(false); //shouldn't ever equal undefined
      expect(targets.includes(players[player].target)).to.equal(false);
      targets.push(players[player].target);
    }

    done();
  });

  it('After a confirmed elimination, remove eliminated player', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
    }
    clock.tick(minute);
    var players = lobby.getPlayers();
    var target = players[0].target;
    clock.tick(minute);
    lobby.eliminatePlayer(players[0], players[target]);
    expect(players[target]).to.equal('eliminated');
    done();
  });

  it('Only returns player\'s target location', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
      // add players to queue
      helper.addOrUpdatePlayer({
        deviceId: i,
        lat: i,
        lng: i
      });
      // add fake loc data of players
    }
    lobby.setGameStatus(true);
    clock.tick(minute);
    
    request(app)
      .get('/locations' + '?deviceId=0')
      .expect(200)
      .expect(res => {
        expect(res.body.deviceId).to.equal(lobby.getPlayers()[0].target)
      })
      .end(done)
  });

  it('Retrieves target location on GET/target', done => {
    for (var i = 0; i < 5; i++) {
      lobby.addToQueue({
        player: i,
        target: null,
        active: 1,
        deviceId: i
      });
      // add players to queue
      helper.addOrUpdatePlayer({
        deviceId: i,
        lat: i,
        lng: i
      });
      // add fake loc data of players
    }
    lobby.setGameStatus(true);
    clock.tick(minute);
    
    request(app)
      .get('/target' + '?deviceId=0')
      .expect(200)
      .expect(res => {
        expect(res.body.deviceId).to.equal(lobby.getPlayers()[0].target)
      })
      .end(done)
  });



});