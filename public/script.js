(function(){
	'use strict';

	function fwController($http){
		this.rules = [];
		this.ip = '';
		this.pwd = '';
		this.$http = $http;
		this.refresh();
	}
	fwController.prototype.add = function(){
		var instance = this;
		if (this.ip.length <= 16){
			instance.$http.post('block', {
				ip: instance.ip,
				pwd: instance.pwd
			})
			.then(function(response){
				instance.refresh();
				instance.ip = '';
			}, function(){
				instance.refresh();
				instance.ip = '';
			});
		}
	};
	fwController.prototype.refresh = function(){
		var instance = this;
		instance.$http
			.get('list')
			.then(function(response){
				instance.rules = response.data;
			}, function(){
				instance.rules = [];
			});
	};

	angular
		.module('fw', [])
		.controller('fwctrl', ['$http', fwController]);
})(angular);
