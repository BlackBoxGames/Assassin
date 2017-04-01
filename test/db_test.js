const expect = require('chai').expect
const User = require('../server/models/user.js')
const Game = require('../server/models/game.js')
const mongoose = require('mongoose')
const Promise = require('bluebird')

mongoose.Promise = Promise;

describe('Database tests', (done) => {

  beforeEach((done) => { 

    mongoose.connect('mongodb://localhost/assassin_test_db')
    mongoose.connection
    .on('error', (e) => console.warn(e))

    var users = mongoose.connection.collections.users
    var games = mongoose.connection.collections.games

    users.drop(() => {
      games.drop(() => {
        user1 = new User({ username: 'johnSnow'})
        user2 = new User({ username: 'jamieLanister'})

        // behind the scenes Mongo is, probably using a setter, setting up references to objectId
        // here rather than taking the whole object as if it were a subdocument

        Promise.all([
          user1.save(),
          user2.save()

        ])
          .then(() => done())
          .catch((err) => console.error(err))
      })
    })
  });
  afterEach((done) => {
    mongoose.connection.close(done);
  });
  
  it('should be able to create and find a user in the database', (done) => {
    User.findOne({'username' : 'johnSnow'}, (err, user) => {
      expect(user.username).to.equal('johnSnow');
      done();
    })
  })

  it('should be able to create and find a game in the database', (done) => {
    User.find({}, (err, users) => {
      var player1 = new Game({
        player: users[0]._id,
        target: users[1]._id,
        active: 1,
        stats: {},
        deviceId: 'abcd1234'
      })

      var player2 = new Game({
        player: users[1]._id,
        target: users[0]._id,
        active: 1,
        stats: {},
        deviceId: 'abcd1235'
      })

      
      player1.save()
      .then(() => {
        return player2.save();
      })
      .then(() => {
        Game.find({}, (err, game) => {
          expect(game[0].player).to.deep.equal(users[0]._id);
          expect(game[1].player).to.not.deep.equal(users[0]._id);
          expect(game[0].active).to.equal(1);
          expect(game[1]).to.exist;
          done();
        })
      })
      .catch((err) => console.error(err))   
    })
  })
})
