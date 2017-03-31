var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server');

var User = require('../server/models/user');
var Game = require('../server/models/game');

xdescribe('Server to DB tests', () => {
	var userId = '';
	it('Should create a new user in the user database', done => {
		request(app)
			.post('/users')
			.send({
				username: 'Nathan_Dick'
			})
			.expect(201)
			.end(done)
	})

	it('Should find a user in the user database', done => {
		request(app)
			.get('/users' + 'Nathan_Dick')
			.expect(200)
			.expect(res => {
				expect(res.body._id).to.exist;
				userId = res.body._id;
				expect(res.body.username).to.equal('Nathan_Dick');
			})
			.end(done)
	})

	it('Should find all users in the user database', done => {
		request(app)
			.post('/users')
			.send({
				username: 'Nathan_Niceguy'
			})
			.expect(201)
			.get('/users')
			.expect(200)
			.expect(res => {
				expect(res.body.users.length).to.equal(2)
				expect(res.body.users[1].username).to.equal('Nathan_Niceguy');
			})
			.end(done)
	})

	it('Should insert a new player into the game database', done => {
		request(app)
			.put('/games')
			.send({
				player: userId,
				target: userId,
				active: 1,
				stats: {},
				deviceId: 'abc123'
			})
			.expect(201)
			.end(done)
	})

	it('Should find a user in a game', done => {
		request(app)
			.get('/games' + 'Nathan_Dick')
			.expect(200)
			.expect(res => {
				expect(res.body.player).to.deep.equal(userId);
				expect(res.body.target).to.deep.equal(userId);
				expect(res.body.active).to.equal(1);
				expect(res.body.stats).to.exist;
				expect(res.body.deviceId).to.equal('abc123');
			})
			.end(done)
	})

	it('Should find all user in a game', done => {
		request(app)
			.put('/games')
			.send({
				player: userId,
				target: userId,
				active: 1,
				stats: {},
				deviceId: 'def456'
			})
			.expect(201)
			.get('/games')
			.expect(200)
			.expect(res => {
				expect(res.body.players.length).to.equal(2)
				expect(res.body.players[1].deviceId).to.equal('def456')
			})
			.end(done)
	})

	it('Should update a user in a game', done => {
		request(app)
			.put('/games')
			.send({
				player: userId,
				target: userId,
				active: 0,
				stats: {},
				deviceId: 'def456'
			})
			.expect(200)
			.expect(res => {
				expect(res.body.active).to.equal(0)
				expect(res.body.deviceId).to.equal('def456')
			})
			.end(done)
	})

	it('Should delete a user from the game', done => {
		app.removePlayerFromGame(userId)
		.then(result => {
			request(app)
			.get('/games' + 'Nathan_Dick')
			.expect(404)
			.expect(res => {
				expect(res.body.player).to.not.exist;
			})
		})
		.end(done)
	})

})