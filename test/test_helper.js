const mongoose = require('mongoose')
// replace Mongo's deprecated, built in Promise library with
// native JS Promises
mongoose.Promise = global.Promise

before((done)=>{  
  /* specify where to look for the server with //localhost
   look for a database called users_test. 
   If it doesn't exist yet, create it 
   listen for an 'open' event once
   on an 'error event'*/
  mongoose.connect('mongodb://localhost/assasin_db')
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (e) => console.warn(e))
}) 

// done is a callback argument that can be used to pause
// the test script until an async action is complete
beforeEach((done) => {
  // mongoose normalizes collection names to lowercase
  const {users, games} = mongoose.connection.collections

  users.drop(() => {
    games.drop(() => {
      done()
    })
  })
/*
invoke done to resume test script running
not invoking done, the script will not continue running
It will time out and fail the test 
because of the default 2 sec time limit 
*/
  // .then(done)
 
})
