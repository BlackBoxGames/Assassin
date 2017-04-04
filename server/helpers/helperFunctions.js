var db = require('./dbConfig')
var User = require('./models/user')
var Game = require('./models/game')

var players = {};
players.length = 0;

var helper = {};

helper.addOrUpdatePlayer = (user) => {
	if (!user) { return 404 }
	if (!players[user.deviceId]) {
		var created = true;
		players.length++;
	}
	players[user.deviceId] = user;
	return created ? 201 : 200;
}

helper.getAllPlayers = () => {
	return players;
}

helper.removePlayerFromGame = (username) => {
	db.connectToDb();
	return User.findOneUser(username)
	.then(data => {
		return Game.deletePlayer(data._id);
	})
	.then(() => {
		db.disconnectFromDb();
		console.log(username + ' was removed from the game');
	});
}

module.exports = helper;