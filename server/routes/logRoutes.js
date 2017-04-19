var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')
var helper = require('../helpers/helperFunctions');
var lobby = require('../helpers/lobby');

router.put('/in', (request, response) => {
	var players = helper.getAllPlayers();
	var client = request.body;
	helper.addOrUpdatePlayer(client);
	var data = db.connectToDb();
	var player = Game.mapLocationToPlayer(client);
	lobby.addToQueue(player);
	Game.insertPlayer(player)
	.then(() => {
		response.status(200).send();
		db.disconnectFromDb();
	});
	//converts a locationObj from client to playerObj and inserts it into database
});

router.put('/out', (request, response) => {
	var players = helper.getAllPlayers();
	var player = request.body;
	if (player.deviceId in players) {
		console.log(players);
		if (players[player.deviceId].lng != null || players[player.deviceId].lat != null) {
				player = {
					deviceId: player.deviceId,
					lng: null,
					lat: null
				}	
			var status = helper.addOrUpdatePlayer(player);
			lobby.removeFromQueue(player);
			response.status(status).send();
		} else {
			//user is already logged out, just send 200
			response.status(200).send();
		}
	} else {
		response.status(400).send();
	}
	
});

module.exports = router;