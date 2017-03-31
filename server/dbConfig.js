var mongoose = require('mongoose');
var path = require('path');
var db = {};

db.connectToDb = () => {
  mongoose.connect('mongodb://localhost/assassin_db');
  return mongoose.connection; 
}

db.disconnectFromDb = () => {
  mongoose.connection.close();
}


module.exports = db;
