const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
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

module.exports = Game;