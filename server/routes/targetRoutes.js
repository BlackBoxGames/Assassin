var express = require('express');
var router = express.Router();
var path = require('path');
var Request = require('request');

var helper = require('../helpers/helperFunctions');
var lobby = require('../helpers/lobby');
//this is bad practice, but for the sake of testing
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmU4NjZiNC1lNDNlLTRmZGUtYjUyOS04N2Y2NGFkNmIxZjgifQ.nvHdqtZwy0YaSSC9AVtIp9CRLRxJ-VN7hFAjYh6NeZU';

//route for eliminating targets
// Request obj with {image, deviceId}
router.post('/', (request, response) => {
  var assassinId = request.body.deviceId;
  var image = request.body.image;

  // should have some verification that the photograph is legit
  // potential checks:
  // self check, distance check
  var players = lobby.getPlayers();
  var targetId = lobby.getPlayerTarget(assassinId);

  var targetObj = players[targetId];
  var assassinObj = players[assassinId];

  lobby.eliminatePlayer(assassinObj, targetObj, image);
  response.status(200).send();

});

// route for giving client the target information (location, username, photo)
router.get('/', (request, response) => {
  var deviceId = request.url.slice(request.url.indexOf('=') + 1);
  var targetId = lobby.getPlayerTarget(deviceId);
  response.status(200).send(lobby.getPlayers()[targetId]);
});

module.exports = router;

router.get('/all', (request, response) => {
  response.status(200).send(lobby.getPlayers());
})

router.get('/queue', (request, response) => {
  response.status(200).send(lobby.getQueue());
})