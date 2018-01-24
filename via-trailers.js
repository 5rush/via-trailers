const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const credentials = require('./credentials.js');
const redis = require('redis');
const PORT = process.env.PORT;
const REDIS_PORT = process.env.REDIS_PORT;

const app = express();
app.set('port', PORT || 3000);

var client = (app.get('env') === 'development') ? redis.createClient(REDIS_PORT) : redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Get the imdb id of the movie
var getImdbId = function(url) {
	return new Promise(function(resolve, reject) {
		axios(url).then(function(response){
			var movieData = response.data;
			if(movieData._embedded){
				
				var imdbData = movieData._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb;
				
				resolve(imdbData.id);
			} else {
				reject(response.data);
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
			resolve(response.data);
		}).catch(function(error){
			reject(error);
		});
	});
};

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

	return new Promise(function(resolve, reject){
		getImdbId(movieURL)
			.then(getMovieVideos)
			.then(function(movieVideos){
				var trailersURLs = movieVideos.results
									.filter(isTrailer)
									.map(getYouTubeURL);
				// Cache the trailers
				client.set(movieURL, JSON.stringify(trailersURLs));
				resolve(trailersURLs);
				}, function(error){
					reject(error);
			});
	});
};

var fetchTrailers = function(req, res, next){
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
};

var cache = function(req, res, next){
	client.get(req.body.url, function (error, data) {
        if (error) {
        	// TODO: error handler
        	next();
        }

        if (data != null) {
            res.status(200).send(JSON.parse(data));
        } else {
           next(); 
        }
    });
};

app.post('/api/trailer', cache, fetchTrailers);

app.listen(app.get('port'), function(){
	console.log('Express started in ' + app.get('env') +
	' mode on http://localhost:' + app.get('port'));
});