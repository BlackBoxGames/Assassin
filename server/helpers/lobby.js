var db = require('../dbConfig')
var User = require('../models/user')
var Game = require('../models/game')
var helper = require('./helperFunctions')
var Request = require('request');

//this is bad practice, but for the sake of testing
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmU4NjZiNC1lNDNlLTRmZGUtYjUyOS04N2Y2NGFkNmIxZjgifQ.nvHdqtZwy0YaSSC9AVtIp9CRLRxJ-VN7hFAjYh6NeZU';

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

  var options = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: {
      tokens: [player.token],
      profile: 'nathan',
      notification: {
        android: {
          message: target.username,
          title: 'Your New Target',
          image: target.image 
        }
      }
    }
  };
  
  if (player.token) {
    Request(options, (error, response, body) => {
      console.log('To the assassin', body);
      // for push notifications
    });
  }
  
};

/*
***
Input: deviceId of player
Grabs location of player's target
Output: Target ID
***
*/
lobby.getPlayerTarget = (player) => {
  var target = lobby.game[player].target;
  if (target) {
    return target;
  }
  return 'Target not found!';
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
lobby.eliminatePlayer = (player, target, image) => {
  var newTarget = target.target;
  if (newTarget === player.player) {
    var message = 'You have killed the last person!';
    var title = 'Victory!';
  } else {
    lobby.assignNewTarget(player, lobby.game[newTarget]);
    var message = 'You were assassinated by ' + player.username;
    var title = 'You\'ve Been Killed!';
  }

  var options = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: {
      tokens: [target.token],
      profile: 'nathan',
      notification: {
        android: {
          message: message,
          title: title,
          image: image
        }
      }
    }
  };
  
  if (target.token) {
    Request(options, (error, res, body) => {
      console.log('To the killed', body);
      //lobby.eliminatePlayer(assassinObj, targetObj);
      lobby.game[target.player] = 'eliminated';
      // for push notifications
    });
    
  }

  if (lobby.queue.length) {
    var head = lobby.queue[0].player;
    var tail = lobby.assignTargets();
    lobby.assignNewTarget(tail, lobby.game[newTarget]);
    lobby.assignNewTarget(player, lobby.game[head]);
  }


  /*if (player.target === player.player) {
    lobby.setGameStatus(false);
  }*/
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
      }, 5 * second);

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

lobby.removeFromQueue = (player) => {
  for (var i = 0; i < lobby.queue.length; i++) {
    if (lobby.queue[i].player === player.player) {
      lobby.queue.splice(i, 1);
      return;
    } 
  }
 };

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

lobby.testPushNotification = (cb) => {
  var options = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: {
      tokens: ['fR7iF3WzeJc:APA91bEXztlHCeJKz0dk62354mFdfHsPbR5-0UxTyykvZ3QzqJE-rcY2e0yBDFEE3Pf_9Ct7alM-LhSXDRHbqFFMPCfzlV9qpOOIUchMZIAMTzDu2qM9aer7Z83oyk8j7NSUUkB0KECu'],
      profile: 'nathan',
      notification: {
        message: 'YOU HAVE BEEN KILLED',
        title: 'Assassin',
        android: {
          message: 'Crazy json string',
          title: 'route',
          count: '3',
          image: 'http://vignette2.wikia.nocookie.net/aion/images/6/69/Assassin.png/revision/latest?cb=20100712233128',
          sound: 'gunshot.wmv',
          target: {did: '123'},
          route: 'ded'
        }
      }
    }
  };
  
  Request(options, (error, response, body) => {
    console.log('This is from the test');
    console.log(response);
    console.log('Body config data',body.data.config);
    cb();
    // for push notifications
  });
}

module.exports = lobby;