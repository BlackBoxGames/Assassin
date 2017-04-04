var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');
var app = require('../server');

var User = require('../models/user')
var Game = require('../models/game')

router.put('/', (request, response) => {
	var status;
	var user = request.body;
	if (!user) { status = 404 }
	if (!app.players[user.deviceId]) {
		var created = true;
		app.players.length++;
	}
	app.players[user.deviceId] = user;
	created ? status = 201 : status = 200;
	response.status(satus).send();
});

router.get('/', (request, response) => {
	console.log(app.players, '<---------')
	response.status(200).send(app.players);
})

module.exports = router;