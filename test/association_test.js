const mongoose = require('mongoose')
const expect = require('chai').expect
const User = require('../user.js')
const Game = require('../game.js')

describe('Associations', (done) => {
  let user, target
  beforeEach((done) => { 
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
  
  
  it('should find the one freakin\' user I created', (done) => {
    User.findOne({'username' : 'johnSnow'}, (err, user) => {
      expect(user.username).to.equal('johnSnow');
      done();
    })
  })

  it('should be able to create a game', (done) => {
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

      Promise.all([
      player1.save(),
      player2.save()

    ])
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
