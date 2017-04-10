var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')
var helper = require('../helpers/helperFunctions.js');

router.put('/in', (request, response) => {
	var players = helper.getAllPlayers();
	var player = request.body;
	helper.addOrUpdatePlayer(player);
	response.status(200).send();
});

router.put('/out', (request, response) => {
	console.log('Starting log off process. . .');
	var players = helper.getAllPlayers();
	var player = request.body;
	console.log('Current player:', player);
	if (player.deviceId in players) {
		console.log(players);
		if (players[player.deviceId].lng != null || players[player.deviceId].lat != null) {
				player = {
					deviceId: player.deviceId,
					lng: null,
					lat: null
				}	
			console.log('Player is being updated. . .');
			var status = helper.addOrUpdatePlayer(player);
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