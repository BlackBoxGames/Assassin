//game routes
var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var User = require('../models/user')
var Game = require('../models/game')

router.get('/', (request, response) => {
	db.connectToDb();
	if(request.url.length === 1) {
		Game.findAllPlayers()
		.then(data => {
			db.disconnectFromDb();
			response.status(200).send(data);
		});
	} else {
		var username = request.url.slice(request.url.indexOf('=') + 1);
		User.findOneUser(username)
		.then(data => {
			Game.findOnePlayer(data._id)
			.then(data => {
				db.disconnectFromDb();
				if (data) {
					response.status(200).send(data);
				} else {
					response.status(404).send();
				}
			});
		});
	}
});

router.put('/', (request, response) => {
	db.connectToDb();
	var username = request.body.username;
	User.findOneUser(username)
	.then(user => {
		Game.findOnePlayer(user._id)
		.then(player => {
			if (player) {
				var key = request.body.type;
				var value = request.body.data;
				Game.updatePlayer({
					key: value
				})
				.then(() => {
					db.disconnectFromDb();
					response.status(200).send();
				});
			} else {
				Game.insertPlayer({
					player: user._id,
					target: user._id,
					active: 1,
					stats: {},
					deviceId: 'abc123'
				})
				.then(() => {
					db.disconnectFromDb();
					response.status(201).send();
				});
			}
		});
	});
});

module.exports = router;