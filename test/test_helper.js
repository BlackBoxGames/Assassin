const mongoose = require('mongoose')

mongoose.Promise = global.Promise

before((done)=>{  

  mongoose.connect('mongodb://localhost/assassin_db')
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (e) => console.warn(e))
}) 

beforeEach((done) => {

  var users = mongoose.connection.collections.users
  var games = mongoose.connection.collections.games

  users.drop(() => {
    games.drop(() => {
      done()
    })
  })

})
