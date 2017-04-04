//user routes
var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../dbConfig');
var User = require('../models/user');
var Game = require('../models/game');
var request = require('request');


router.get('/', (request, response) => {
  var data = db.connectToDb();
  if (request.url.length === 1){
    User.findAllUsers()
    .then (data => {
      db.disconnectFromDb();
      response.status(200).send(data);
    });
  } else {
    var username = request.url.slice(request.url.indexOf('=') + 1);
    User.findOneUser(username)
    .then(data => {
      db.disconnectFromDb();
      response.status(200).send(data);
    });
  }
  
});

router.put('/', (request, response) => {
  var data = db.connectToDb();
  var username = request.body.username
  User.insertUser(username)
  .then(data => {
    response.status(201).send()
    return
  }).then(() => {
    db.disconnectFromDb();
  });
});

router.delete('/', (request, response) => {
  var data = db.connectToDb();
  var username = request.url.slice(request.url.indexOf('=') + 1);
  User.deleteUser(username)
  .then(response => {
  //  db.disconnectFromDb();
    response.status(202).send()
  });
})

module.exports = router;