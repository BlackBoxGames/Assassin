var db = require('../dbConfig')
var User = require('../models/user')
var Game = require('../models/game')

var players = {};
players.length = 0;

var helper = {};

helper.addOrUpdatePlayer = (user) => {
	var created = false;
	if (!user) { return 404 }
		//data was corrupt
	if (!players[user.deviceId]) {
		created = true;
		players.length++;
	}
	
	players[user.deviceId] = user;
	return created ? 201 : 200;
}

helper.getAllPlayers = () => {
	return players;
}

helper.removePlayerFromGame = (deviceId) => {
	db.connectToDb();
	return Game.deletePlayer(deviceId)
	.then(() => {
		db.disconnectFromDb();
		console.log(deviceId + ' was removed from the game');
	});
}

module.exports = helper;