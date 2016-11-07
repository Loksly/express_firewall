(function(module){
	'use strict';
	var iptables = require('netfilter').iptables,
		Q = require('q');

	module.exports.dump = function(chain){
		var defer = Q.defer();

		if (typeof chain === 'undefined'){
			chain = 'INPUT';
		}
		var fn = function(defer, chain){
			return function(err, d){
				if (err){
					defer.reject(err);
				} else {
					defer.resolve(d.filter.chains[chain]);
				}
			};
		};

		iptables.dump({ sudo: true }, fn (defer, chain));
		return defer.promise;
	};

	module.exports.block = function(ip){
		var defer = Q.defer();
		var fn = function(defer){
			return function(err){
				if (err){
					defer.reject(err);
				} else {
					defer.resolve();
				}
			};
		};

		iptables.insert({
				'chain': 'INPUT',
				'source': ip,
				'destination-port': 80,
				'protocol': 'TCP',
				'jump': 'DROP',
				'sudo': true
			}, fn(defer) );
		return defer.promise;
	};

})(module);

//visudo
//netfilter ALL=NOPASSWD: /sbin/iptables, /sbin/ip6tables, /sbin/ipset