(function(){
	'use strict';
	var express = require('express'),
		bodyParser = require('body-parser'),
		iptables = require('./lib/iptables'),
		app = express(),
		port = process.env.PORT && process.env.PORT !== '' ? parseInt(process.env.PORT) : 9998,
		pwd = process.env.PWD && process.env.PWD !== '' ? process.env.PWD.trim() : 'qwerty';

	app
		.use(bodyParser.json())
		.get('/list', function(req, res){
			iptables
				.dump()
				.then(function(data){
					res.json(data);
				}, function(err){
					res.status(500).json(err);
				});
		})
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