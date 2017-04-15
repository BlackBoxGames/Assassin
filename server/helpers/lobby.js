var db = require('../dbConfig')
var User = require('../models/user')
var Game = require('../models/game')
var helper = require('./helperFunctions')

var lobby = {};
lobby.gameActive = false;
lobby.queue = [];
lobby.timer = null;
lobby.game = {};

const second = 1000;
const minute = second * 60;


/*
***
Returns the tail of the list.
Function that is called when game begins.  Algorithm to assign targets to players.
Players should not have the same target.
Players should not have themself as a target.
***
 */
lobby.assignTargets = () => {
  //should only be called when queue has players, but check anyway
  if (lobby.queue.length) {
    var head = lobby.queue.shift();
    var player = head;
    
    
    while (lobby.queue.length) {
      var target = lobby.queue.splice(Math.floor(Math.random() * lobby.queue.length - 1), 1)[0];
      // choose a random target
      lobby.assignNewTarget(player, target);
      player = target;
    }
    lobby.assignNewTarget(player, head)
    return player;
  }
};

/*
***
Input: {player: playerObject, target: playerObject}
Assigns target to player and notifies player through push notification
who their target is
***
 */
lobby.assignNewTarget = (player, target) => {
  player.target = target.player;
  lobby.game[player.player] = player;
};

/*
***
Output: Boolean of current active game status
***
 */
lobby.getGameStatus = () => {
  return lobby.gameActive;
  
};

/*
***
Input: Boolean value
Sets the game status to active when game initiates
Should be called by a timer after queue is full
***
 */
lobby.setGameStatus = (active) => {
  lobby.gameActive = active;
  if (lobby.gameActive) {
    console.log('Game was set to active');
    lobby.assignTargets();
  }
};

/*
***
Input: {player: playerObject, target: playerObject}
Should remove player from active game
Should change live player's target to eliminated player's target
***
 */
lobby.eliminatePlayer = (player, target) => {
  var newTarget = target.target;
  lobby.assignNewTarget(player, lobby.game[newTarget]);
  lobby.game[target.player] = 'eliminated';

  if (lobby.queue.length) {
    var head = lobby.queue[0].player;
    var tail = lobby.assignTargets();
    lobby.assignNewTarget(tail, lobby.game[newTarget]);
    lobby.assignNewTarget(player, lobby.game[head]);
  }


  if (player.target === player.player) {
    lobby.setGameStatus(false);
  }
 };

/*
***
Input: {player: playerObject}
Adds users to queue.  Checks condition for starting the game through a timer
If players.length === 1, wait indefintely, 
If players.length < 5, init game in 5 minutes,
if players.length >= 5, init game in 1 minute
Reset timer every time addToQueue is called

***
 */
lobby.addToQueue = (player) => {
  //check to see if the player isn't already queued
  if (lobby.game[player.player] === 'eliminated') {
    console.log('Player', player.player, 'has already been eliminated');
    return null;
  }

  for (var enqueue of lobby.queue) {
    if (enqueue.player === player.player) {
      console.log('Player', player.player, 'has already been added to the queue');
      return null;
    } 
  }

  lobby.queue.push(player);

  //only set the timer if the game hasn't started yet
  if (!lobby.getGameStatus()) {
    if (lobby.queue.length === 1) {
      clearTimeout(lobby.timer);

    } else if (lobby.queue.length < 5) {
      clearTimeout(lobby.timer);
      lobby.timer = setTimeout(() => {
        lobby.setGameStatus(true);
      }, 5 * minute);

    } else {
      clearTimeout(lobby.timer);
      lobby.timer = setTimeout(() => {
        lobby.setGameStatus(true);
      }, minute);
    }
  }
};

/*
***
Output: Player object of queued players
***
 */
lobby.getQueue = () => {
  return lobby.queue;

};

lobby.clearQueue = () => {
  lobby.queue = [];

};

lobby.getPlayers = () => {
  return lobby.game;
}

lobby.clearPlayers = () => {
  lobby.game = {};
}

module.exports = lobby;