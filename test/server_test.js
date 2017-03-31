// var request = require('supertest');
// var express = require('express');
// var expect = require('chai').expect;
// var app = require('../server/server');

// var db = require('../server/db_config');
// var User = require('../server/models/user');
// var Game = require('../server/models/game');

// describe('Server to DB tests', () => {
// 	var userId = '';
// 	// create new user
// 	it('Should create a new user', done => {
// 		request(app)
// 			.post('/users')
// 			.send({
// 				username: 'Nathan_Dick'
// 			})
// 			.expect(201)
// 			.end(done)
// 	})
// 	// get a user
// 	it('Should find a user in the database', done => {
// 		request(app)
// 			.get('/users' + 'Nathan_Dick')
// 			.expect(200)
// 			.expect(res => {
// 				expect(res.body._id).to.exist;
// 				userId = res.body._id;
// 				expect(res.body.username).to.equal('Nathan_Dick');
// 			})
// 			.end(done)
// 	})
// 	// create new game
// 	it('Should insert a new player into the game', done => {
// 		request(app)
// 			.post('/games')
// 			.send({
// 				player: userId,
// 				target: userId,
// 				active: 1
// 				stats: {}
// 				deviceId: 'abc123'
// 			})
// 			.expect(201)
// 			.end(done)
// 	})
// 	// get one user from game
// 	it('Should find a user in the database', done => {
// 		request(app)
// 			.get('/games' + 'Nathan_Dick')
// 			.expect(200)
// 			.expect(res => {
// 				expect(res.body.player).to.deep.equal(userId);
// 				expect(res.body.target).to.deep.equal(userId);
// 				expect(res.body.active).to.equal(1);
// 				expect(res.body.stats).to.exist;
// 				expect(res.body.deviceId).to.equal('abc123');
// 			})
// 			.end(done)
// 	})
// 	// get all users from game

// 	// update a user in game
	
// 	// delete user from game
// })