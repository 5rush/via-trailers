const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const credentials = require('./credentials.js');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Get the imdb id of the movie
var getImdbId = function(url) {
	return new Promise(function(resolve, reject) {
		axios(url).then(function(response){
			let movieData = response.data;
			if(movieData._embedded){
				
				let imdbData = movieData._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb;
				console.log(imdbData.id);
				resolve(imdbData.id);
			} else {
				console.log('The url you provided is not correct.');
				reject('The url you provided is not correct.');
			}
		}).catch(function(error){
			reject(error);
		});
	});
};

// Get movie videos stored in moviedb
var getMovieVideos = function(id){
	var url = 'https://api.themoviedb.org/3/movie/' + id +
	 '/videos?api_key=' + credentials.moviedb.api_key.development;
	return new Promise(function(resolve, reject){
		axios(url).then(function(response){
			console.log(response.data);
			resolve(response.data);
		}).catch(function(error){
			reject(error);
		});
	});
};

var movieCache = {};

var getMovieTrailers = function (movieURL) {
	
	// Filter for trailers
	var isTrailer = function(videoObject){
		if(videoObject.type==='Trailer'){
			return true;
		}
	};

	// Building YouTube Trailer URLs
	var getYouTubeURL = function(trailerObject){
		if(trailerObject.site === 'YouTube' && trailerObject.key){
			return 'https://www.youtube.com/watch?v=' + trailerObject.key;
		}
	};

	if (movieCache[movieURL]) {
		console.log('in cache!!');
		return Promise.resolve(movieCache[movieURL]);
	}

	return new Promise(function(resolve, reject){
		getImdbId(movieURL)
			.then(getMovieVideos)
			.then(function(movieVideos){
				var trailersURLs = movieVideos.results
									.filter(isTrailer)
									.map(getYouTubeURL);
				
				movieCache[movieURL] = trailersURLs;
				resolve(trailersURLs);
				}, function(error){
					reject(error);
				});
	});
};

app.post('/api/trailer', function(req, res){
	var movieUrl = req.body.url;

	getMovieTrailers(movieUrl)
	 .then(function(response){
	 		console.log(response);
			res.status(200).send(response);
		}, function(error){
				var errObj = {
					status_message: "Bad Request",
					request_object: req.body
				};

				res.status(404).send(errObj);
			}
		);
});

app.listen(app.get('port'), function(){
	console.log('Express started in ' + app.get('env') +
	' mode on http://localhost:' + app.get('port'));
});