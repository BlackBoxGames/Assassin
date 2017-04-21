var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')
var helper = require('../helpers/helperFunctions');
var lobby = require('../helpers/lobby');
const second = 1000;
const minute = second * 60;
var logoutTimers = {};

router.put('/in', (request, response) => {
	var players = helper.getAllPlayers();
	var client = request.body;
	helper.addOrUpdatePlayer(client);
	// var data = db.connectToDb();
	if (logoutTimers[client.deviceId]) {
		clearTimeout(logoutTimers[client.deviceId]);
		delete logoutTimers[client.deviceId];
		response.status(200).send();	
	} else {
		var player = Game.mapLocationToPlayer(client);
		lobby.addToQueue(player);
		response.status(200).send();	
	}
	
	/*Game.insertPlayer(player)
	.then(() => {
		response.status(200).send();
		db.disconnectFromDb();
	});*/
	//converts a locationObj from client to playerObj and inserts it into database
});

router.put('/out', (request, response) => {
	var locations = helper.getAllPlayers();
	var user = request.body;

	// player logs out --
	// need to check if in queue, then remove
	// if in game, eliminate in one minute
	// remove location after that

	// is player in location?
	if (locations[user.deviceId]) {
		user.player = user.deviceId;

		//if player wasn't removed, then they're probably in the game
		if (!lobby.removeFromQueue(user)) {
			// if they logged out of the game
			// they need to be eliminated in one minute, reassigning their target
			// to their assassin
			response.status(200).send();

			logoutTimers[user.deviceId] = setTimeout(() => {
				var players = lobby.getPlayers();
				var target = players[user.deviceId]; //playerObj	
				var assassin;
				for (var player in players) {
					// player will be player keys
					if (players[player].target === target.player) {
						assassin = players[player]
						continue;
					}
				}

				lobby.eliminatePlayer(assassin, target);
				// deletes him from the game
				helper.removePlayerFromGame(user.deviceId);
				// deletes his location
				delete logoutTimers[user.deviceId];
				// delete the timer
			}, minute);
		} else {
			//user is not in the game and was removed from queue, just send 200
			helper.removePlayerFromGame(user.deviceId);
			response.status(200).send();
		}
	} else {
		response.status(400).send();
	}
	
});

module.exports = router;