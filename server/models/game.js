const mongoose = require('mongoose')
const Promise = require('bluebird')
const Schema = mongoose.Schema
var db = require('../dbConfig');

mongoose.Promise = Promise;
 
const GameSchema = new Schema({
   player : {
    // type: Schema.Types.ObjectId,
    // ref: 'User'
    type: String
   },
   target: {
    // type: Schema.Types.ObjectId,
    // ref: 'User'
    type: String
   },
   active : Number,
   deviceId : String
})

const Game = mongoose.model('game',GameSchema);

Game.findOnePlayer = (userId) => {
  return Game.findOne({ player: userId })
  .then(response => {
    return response;
  })
  .catch(err => {
    console.error(err);
  })
};

Game.findAllPlayers = () => {
  return Game.find({})
  .then(response => {
    return response;
  })
  .catch(err => {
    console.error(err);
  })
};

Game.insertPlayer = (user) => {
  return Game.create(user)
  .then(response => {})
  .catch(err => {
    console.error(err);
  })
};

Game.updatePlayer = (user) => {
  return Game.updateOne(user)
  .then(response => {})
  .catch(err => {
    return err;
  })
};

Game.deletePlayer = (deviceId) => {
  return Game.deleteOne({ deviceId: deviceId })
  .then(response => {})
  .catch(err => {
    console.error(err);
  })
};

/*
***
Function to take a locationObj receieved from the client device 
i.e {lat, lng, deviceId}
to a Player object
Input: locationObj received from client
Outpat: gameModel parsed from locationObj
***
 */
Game.mapLocationToPlayer = (locationObj) => {
  var gameModel = {
    player: null,
    target: null,
    active: null,
    deviceId: null,
    token: null,
    username: null
  };

  //player and deviceId will be identical for now
  //until we get users working

  gameModel.player = locationObj.deviceId;
  gameModel.deviceId = locationObj.deviceId;
  gameModel.active = true;
  gameModel.token = locationObj.token;
  gameModel.username = locationObj.username || 'Guest';
  return gameModel;
};

module.exports = Game;