var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')

router.put('/', (request, response) => {
	var players = helper.getAllPlayers();
	var deviceId = request.body.deviceId;
	var player = request.body;
	if (deviceId in players) {
		helper.removePlayerFromGame(deviceId)
		player = {
			deviceId: deviceId,
			lon: null,
			lat: null
		}
	}
	helper.addOrUpdatePlayer(player);
})

module.exports = router;