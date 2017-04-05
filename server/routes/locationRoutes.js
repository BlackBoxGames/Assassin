var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');
var helper = require('../helpers/helperFunctions.js');

var User = require('../models/user')
var Game = require('../models/game')

router.put('/', (request, response) => {
	response.status(helper.addOrUpdatePlayer(request.body)).send();
});

router.get('/', (request, response) => {
	var players = helper.getAllPlayers();
	response.status(200).send(players);
})

module.exports = router;