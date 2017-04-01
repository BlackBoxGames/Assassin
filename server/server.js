var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var db = require('./dbConfig')
var app = express();

var User = require('./models/user')
var Game = require('./models/game')

//Route Modules
var userServer = require('./routes/userRoutes.js');
var gameServer = require('./routes/gameRoutes.js');

//Middleware

app.use(bodyParser.json());
app.use(morgan('combined'));


//Routers
app.use('/users', userServer);
app.use('/games', gameServer);

var port = 4000;
app.listen(port, function(){
  console.log('Server listening on port', port);
});

app.removePlayerFromGame = (username) => {
	db.connectToDb();
	return User.findOneUser(username)
	.then(data => {
		return Game.deletePlayer(data._id);
	})
	.then(() => {
		db.disconnectFromDb();
		console.log(username + ' was removed from the game');
	});
}

module.exports = app;