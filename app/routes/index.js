'use strict';

var path = process.cwd();
var User = require('../models/users.js');
var Poll = require('../models/polls.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	app.post('/login', passport.authenticate('local'), function(req, res) {
		res.redirect('/');
	});
	app.get('/testAppend', function(req, res){
		Poll.addOption("59bdd132b2c2ba324cc87fe7", "Extra Option");
		res.send("Added!");
	})
	app.get('/testList', function(req, res){
		Poll.listByUserID(1, function(err, results){
			if(err) console.log('err');
			else{
				res.send(results);
			}
		})
	})	
	app.route('/')
		.get(function (req, res) {
			if(req.isAuthenticated()){
				res.sendFile(path + '/public/index.html');
			}
			else{
				res.redirect('/all');

			}
		});
	app.route('/all')
		.get(function(req, res){
			Poll.find({}, function(err, polls){
				res.render(path + '/app/views/polls_list_all.ejs', {polls: polls});				
			});
		})
	app.route('/polls/:pollID')
		.get(function(req, res){
			var pollID = req.params.pollID;
			Poll.findOne({_id: pollID}, function(err, result){
				if(err) {
					//TODO Remove debugging line 
					res.send(err)
				}
				else{
					res.render(path + '/app/views/poll_single.ejs', {poll: result});
				}
			})
		})
	app.route('/vote/:pollID/:optionID')
	.get(function(req, res){
		var pollID = String(req.params.pollID);
		var optionID = String(req.params.optionID);
		Poll.registerVote(pollID, optionID);
		res.redirect('/polls/' +pollID);
	})
	app.route('/create')
		.post(function(req, res){

			  var pollObj = {
				ownerID: req.body.owner,
				ownerName: req.body.user,
				name: req.body.pollName, 
				options: [{name: req.body.o1, votes: 0},{name: req.body.o2, votes: 0},{name: req.body.o3, votes: 0}]
			  }

			  Poll.create(pollObj, function(err, poll){
				  if(err){
					console.log(err.toString());
					res.send("Failed to Create Poll!");
				  }
				  else{
					res.send("Poll Created! : " + poll.name);
				  }

			  })
		  
		})
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	app.route('/register')
		.get(function(req,res){})
		.post(function(req, res){
			//If we have an email, password and name
			if(req.body.email && req.body.password && req.body.name){
				var userObj = {
					"name": req.body.name,
					"email": req.body.email,
					"password": req.body.password
					};
				User.create(userObj, function(err, createdUser){
					//TODO: Remove code that sends debugging info to the user's browser.
					if (err){
						if(err.code === 11000){
							//If the email address entered already exists in the DB the error code will be "11000" due to a duplicate key.
							res.send("That email address is already registered!");
						}
						else{
							res.send(err);
						}

					}
					else{
						res.send(createdUser);
					}
				})
			}
			else{
				//For some reason the input from the form was wrong
				res.send("<p>All form fields must be filled in.</p>");
			}
		})





};
