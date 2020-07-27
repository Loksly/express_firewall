(function(module){
	'use strict';
	const iptables = require('netfilter').iptables;

	module.exports.dump = function(chain){
		return new Promise((resolve, reject) => {
			if (typeof chain === 'undefined'){
				chain = 'INPUT';
			}
			const fn = function(chain){
				return function(err, d){
					if (err){
						reject(err);
					} else {
						resolve(d.filter.chains[chain]);
					}
				};
			};

			iptables.dump({ sudo: true }, fn(chain));
		});
	};

	module.exports.block = function(ip){
		return new Promise((resolve, reject) => {
			iptables.insert({
				'chain': 'INPUT',
				'source': ip,
				'destination-port': 80,
				'protocol': 'TCP',
				'jump': 'DROP',
				'sudo': true
			}, (err) => {
				if (err) { reject(err); } else { resolve(); }
			});
		});
	};

})(module);

//visudo
//netfilter ALL=NOPASSWD: /sbin/iptables, /sbin/ip6tables, /sbin/ipset