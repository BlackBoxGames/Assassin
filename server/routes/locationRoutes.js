var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var request = require('request');
var helper = require('../helpers/helperFunctions.js');
var lobby = require('../helpers/lobby.js');

var User = require('../models/user')
var Game = require('../models/game')

router.put('/', (request, response) => {
	response.status(helper.addOrUpdatePlayer(request.body)).send();
});

router.get('/', (request, response) => {
  var location;
  if (request.url.length === 1) {
	 location = helper.getAllPlayers(); 
  } else {
    var deviceId = request.url.slice(request.url.indexOf('=') + 1);
    var target = lobby.getPlayerTarget(deviceId);
    location = helper.getOnePlayerLocation(target);
  }
  var locObj = {};
  locObj[deviceId] = location;
	response.status(200).send(locObj);
})

module.exports = router;