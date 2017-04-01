var mongoose = require('mongoose');
const Promise = require('bluebird')
var path = require('path');
var db = {};

mongoose.Promise = Promise;

db.connectToDb = () => {
  mongoose.connect('mongodb://localhost/assassin_db');
  return mongoose.connection; 
}

db.disconnectFromDb = () => {
  mongoose.disconnect();
}


module.exports = db;
