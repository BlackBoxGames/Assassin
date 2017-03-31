var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/assassin_db');
var db = mongoose.connection; 

module.exports = db;
