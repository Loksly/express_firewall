(function(){
	'use strict';
	const express = require('express');
	const bodyParser = require('body-parser');
	const iptables = require('./lib/iptables');
	const app = express();
	const port = process.env.PORT && process.env.PORT !== '' ? parseInt(process.env.PORT) : 9998;
	const pwd = process.env.PWD && process.env.PWD !== '' ? process.env.PWD.trim() : 'qwerty';

	app
		.get("/css/bootstrap.min.css", (req, res) => {
			res.sendFile("./node_modules/bootstrap/dist/css/bootstrap.min.css");
		})
		.get("/js/bootstrap.min.js", (req, res) => {
			res.sendFile("./node_modules/bootstrap/dist/js/bootstrap.min.js");
		})
		.get("/js/angular.min.js", (req, res) => {
			res.sendFile("./node_modules/angular/angular.min.js");
		})
		.get("/js/jquery.min.js", (req, res) => {
			res.sendFile("./node_modules/jquery/dist/jquery.min.js");
		})
		.get('/list', function(req, res){
			iptables
				.dump()
				.then(function(data){
					res.json(data);
				}, function(err){
					res.status(500).json(err);
				});
		})
		.use(bodyParser.json())
		.post('/block', function(req, res){
			if (typeof req.body.ip === 'undefined')
			{
				res.status(404).end();
			} else {
				var ip = req.body.ip;
				if (typeof req.body.pwd !== 'undefined' && pwd === req.body.pwd.trim()){
					iptables
						.block(ip)
						.then(function(){
							res.json({ok: 'ok'});
						}, function(err){
							res.status(500).json({err: err});
						});
					} else {
						res.status(403).send({err: 'Not allowed'});
					}
			}
		})
		.use(express.static('public'))
		.listen(port, function () {
			console.log('Listening on port ' + port);
		});
})();

//http://askubuntu.com/questions/192050/how-to-run-sudo-command-with-no-password/443071#443071