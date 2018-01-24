var assert = require('chai').assert;
var http = require('http');
var rest = require('restler');

var base = 'http://localhost:3000';

suite('API tests', function(){

	var movieUrl = {
		url:"https://content.viaplay.se/pc-se/film/passengers-2016"
	};

	test('should be able to retrieve a list of movie trailer URLs', function(done){
		rest.post(base + '/api/trailer', { data: movieUrl }).on('success', function(data){
			assert.isArray(data);
			done();
		});
	});
});