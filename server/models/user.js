const mongoose = require('mongoose')
const Promise = require('bluebird')
const Schema = mongoose.Schema;
var db = require('../dbConfig');


mongoose.Promise = Promise;

 
const UserSchema = new Schema({
  username: String,
})

var User = mongoose.model('user', UserSchema);

User.findOneUser = function(username) {

  return User.findOne({'username': username})
  .then((response) => {
    return response;
  })
  .catch(err => {
    console.error(err);
  });
};

User.findAllUsers = function() {
  return User.find({})
  .then((response) => {
    return response;
  })
  .catch(err => {
    console.error(err);
  });
};

User.insertUser = function(username) {
  return User.findOne({username: username})
  .then((response) => {
    if (response){
      //TODO: Add ability to change username 
    } else {
      return User.create({username: username})
      .then(result => {
      });
    }
  })
  .catch(err => {
    console.error(err);
  });
}

User.deleteUser = function(username) {
  return User.findOne({username: username})
  .then((response) => {
    if (response.username) {
      return User.deleteOne({username: username})
    }
    return response;
  })
  .catch(err => {
    console.error(err);
  });
}



module.exports = User