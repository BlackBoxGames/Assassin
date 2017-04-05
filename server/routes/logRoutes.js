var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')
var helper = require('../helpers/helperFunctions.js');

router.put('/', (request, response) => {
	var players = helper.getAllPlayers();
	var player = request.body;
	if (player.deviceId in players) {
		if (players[player.deviceId].lon != null || players[player.deviceId].lat != null) {
			helper.removePlayerFromGame(player.deviceId)
			player = {
				deviceId: player.deviceId,
				lon: null,
				lat: null
			}
		}
	}
	helper.addOrUpdatePlayer(player);
	response.status(200).send();
})

module.exports = router;