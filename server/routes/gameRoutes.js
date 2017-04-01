//game routes
var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');

var Users = require('../models/user')
var Games = require('../models/game')

router.get('/', (request, response) => {
	db.connectToDb();
	if(request.url.length === 1) {
		Game.findAllPlayers()
		.then(data => {
			db.disconectFromDb();
			response.status(200).send(data);
		});
	} else {
		var username = request.url.slice(request.url.indexOf('=') + 1);
		User.findOneUser(username)
		.then(data => {
			Game.findOnePlayer(data._id)
			.then(data => {
				db.disconectFromDb();
				response.status(200).send(data);
			});
		});
	}
});

router.put('/', (request, response) => {
	db.connectToDb();
	var username = request.body.username;
	User.findOneUser(username)
	.then(response => {
		Game.findOnePlayer(response._id)
		.then(response => {
			if (response.player) {
				Game.updatePlayer(response)
				.then(() => {
					db.disconectFromDb();
					response.status(200).send();
				});
			} else {
				Game.insertPlayer({
					player: response._id,
					target: response._id,
					active: 1,
					stats: {},
					deviceId: 'abc123'
				})
				.then(() => {
					db.disconectFromDb();
					response.status(201).send();
				});
			}
		});
	});
});

router.delete('/', (request, response) => {
	db.connectToDb();
	var username = request.body.username;
	// var username = request.url.slice(request.url.indexOf('=') + 1);
	User.findOneUser(username)
	.then(response => {
		Game.deletePlayer(response._id);
	})
	.then(() => {
		db.disconectFromDb();
	});
});

module.exports = router;