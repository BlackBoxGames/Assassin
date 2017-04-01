const mongoose = require('mongoose')
const Promise = require('bluebird')
const Schema = mongoose.Schema
var db = require('../dbConfig');

mongoose.Promise = Promise;
 
const GameSchema = new Schema({
   player : {
    type: Schema.Types.ObjectId,
    ref: 'User'
   },
   target: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   },
   active : Number,
   stats : {kills: Number, 
            deaths: Number, 
            avgKillDistance: Number,
            honesty: Number
          },
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
  return Game.insertOne(user)
  .then(response => {})
  .catch(err => {
    console.error(err);
  })
};

Game.updatePlayer = (user) => {
  return Game.updateOne(user)
  .then(response => {})
  .catch(err => {
    console.error(err);
  })
};

Game.deletePlayer = (userId) => {
  return Game.deleteOne({ player: userId })
  .then(response => {})
  .catch(err => {
    console.error(err);
  })
};

module.exports = Game;