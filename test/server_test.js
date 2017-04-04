var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server');

var User = require('../server/models/user');
var Game = require('../server/models/game');

describe('Server to DB tests', () => {
	var userId = '';
	it('Should create a new user in the user database', done => {
		request(app)
			.put('/users')
			.send({
				username: 'Nathan_Dick'
			})
			.expect(201)
			.end(done)
	})

	it('Should find a user in the user database', done => {
		request(app)
			.get('/users' + '?username=Nathan_Dick')
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
			.put('/users')
			.send({
				username: 'Nathan_Niceguy'
			})
			.expect(201)
			.expect(() => {
				request(app)
					.get('/users')
					.expect(200)
					.expect(res => {
						expect(res.body.length > 1).to.be.true;
						expect(res.body[1].username).to.equal('Nathan_Niceguy');
					})
				})
			.end(done)
	})

	it('Should insert a new player into the game database', done => {
		request(app)
			.put('/games')
			.send({username: 'Nathan_Dick'})
			.expect(201)
			.end(done)
	})

	it('Should find a player in a game', done => {
		request(app)
			.get('/games' + '?username=Nathan_Dick')
			.expect(200)
			.expect(res => {
				expect(res.body.player).to.deep.equal(userId);
				expect(res.body.target).to.deep.equal(userId);
				expect(res.body.active).to.equal(1);
				expect(res.body.deviceId).to.equal('abc123');
			})
			.end(done)
	})

	it('Should find all players in a game', done => {
		request(app)
			.put('/games')
			.send({username: 'Nathan_Niceguy'})
			.expect(201)
			.expect(() => {
				request(app)
					.get('/games')
					.expect(200)
					.expect(res => {
						expect(res.body.players.length).to.equal(2)
						expect(res.body.players[1].deviceId).to.equal('def456')
					})
			})
			.end(done)
	})

	it('Should update a player in a game', done => {
		request(app)
			.put('/games')
			.send({
				username: 'Nathan_Dick',
				type: 'active',
				data: 0
			})
			.expect(200)
			.expect(() => {
				request(app)
				  .get('/games' + '?username=Nathan_Dick')
				  .expect(res => {
						expect(res.body.active).to.equal(0)
				  })
			})
			.end(done)
	})

	it('Should delete a player from the game', done => {
		app.removePlayerFromGame('Nathan_Dick')
		.then(result => {
			request(app)
			.get('/games' + '?username=Nathan_Dick')
			.expect(404)
			.expect(res => {
				expect(res.body.player).to.not.exist;
			})
			.end(done)
		})
	})

	after(done => {
		app.removePlayerFromGame('Nathan_Niceguy').then(done)
	})
})

+describe('Server to client tests', () => {
	var nathan = {
		deviceId: '123abc',
		lon: 50,
		lat: 50
	};
	var burk = {
		deviceId: '456def',
		lon: 75,
		lat: 75
	};
	var david = {
		deviceId: '789ghi',
		lon: 25,
		lat: 25
	};
	var players = [nathan, burk, david];
	it('Should change user and player locations', done => {
		request(app)
			.put('/loc')
			.send(nathan)
			.expect(201)
			.expect(() => {
				expect(app.players.length).to.equal(1);
			})
			.then(() => {
				.put('/loc')
				.send(burk)
				.expect(201)
				.expect(() => {
					expect(app.players.length).to.equal(2);
				})
			})
			.then(() => {
				.put('/loc')
				.send(david)
				.expect(201)
				.expect(() => {
					expect(app.players.length).to.equal(3);
				})
			})
			.then(() => {
				.put('/loc')
				.send({
					deviceId: '789ghi',
					lon: 100,
					lat: 100
				})
				.expect(200)
				.expect(() => {
					expect(app.players.length).to.equal(3);
					expect(app.players[2].lon).to.equal(100);
					expect(app.players[2].lat).to.equal(100);
				})
			})
			.done();
	})
	it('Should get all other players\' locations', done => {
		request(app)
			.get('/loc')
			.expect(200)
			.expect(res => {
				expect(res.body.players.length).to.equal(3);
			})
			.done();
	})


	it('Should toggle activity', done => {
		request(app)
			.put('/log')
			.send(david)
			.expect(() => {
				expect(app.players.length).to.equal(2);
			})
			.then(() => {
				request(app)
					.put('/log')
					.send(david)
					.expect(() => {
						expect(app.players.length).to.equal(3);
					})
			})
			.done();
	})
});