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
var locationServer = require('./routes/locationRoutes.js');
var logServer = require('./routes/logRoutes.js');

//Middleware

app.use(bodyParser.json());
app.use(morgan('combined'));

//Routers
app.use('/users', userServer);
app.use('/games', gameServer);
app.use('/locations', locationServer);
app.use('/logs', logServer);

var port = 0904;
app.listen(port, function(){
  console.log('Server listening on port', port);
});

module.exports = app;