var db = require('../dbConfig')
var User = require('../models/user')
var Game = require('../models/game')

var players = {};
players.length = 0;

var helper = {};

helper.addOrUpdatePlayer = (user) => {
	var created = false;
	if (!user.deviceId) { return 404 }
		//data was corrupt
	if (!players[user.deviceId]) {
		//Game.insertPlayer();
		created = true;
		players.length++;
	}
	console.log('The user id', user.deviceId);
	players[user.deviceId] = user;
	return created ? 201 : 200;
}

helper.getAllPlayers = () => {
	return players;
}

helper.getOnePlayerLocation = (player) => {
	return players[player];
}

helper.removePlayerFromGame = (deviceId) => {
	delete players[deviceId];
	players.length--;
	/*db.connectToDb();
	return Game.deletePlayer(deviceId)
	.then(() => {
		db.disconnectFromDb();
		console.log(deviceId + ' was removed from the game');
	});*/
}

module.exports = helper;