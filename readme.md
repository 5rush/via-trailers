# Application Description

REST API for providing clients with trailer URLs. 

The API takes a movie resource link (e.g. https://content.viaplay.se/pc-se/film/arrival-2016) in a body of POST request and returns the URLs of the trailers that are stored in movidedb.


# RESTful API

__POST */api/trailer*__
	Takes Viaplay Movie Resource Example Link in the request body.

	Returns an array of movie trailers.

__Example__

POST request

```
{
	"url":"https://content.viaplay.se/pc-se/film/arrival-2016"
}
```

Response

```
[
    "https://www.youtube.com/watch?v=tFMo3UJ4B4g",
    "https://www.youtube.com/watch?v=WH9F4WkvhRk"
]
```

# Links

Viaplay Content API
http://content.viaplay.se/pc-se/film

Viaplay Movie Resource Example Link
https://content.viaplay.se/pc-se/film/arrival-2016

TMDb API
https://www.themoviedb.org/documentation/api

Example Link That Your API Should Respond With
https://www.youtube.com/watch?v=AMgyWT075KY


# Running the app locally
* Clone the repository by using the following web URL: https://github.com/5rush/via-trailers.git
* Install dependencies: `npm install`
* To be able to run the app locally you will have to have Redis installed: `sudo apt-get install redis-server`
* Start Redis server: `redis-start`
* Run the app with the following command: `nodejs via-trailers.js`
* For easier testing import Postman collection from the following link: https://www.getpostman.com/collections/297b276bda09e55aa0a3

# Running tests locally
* All tests are in /qa/tests-api.js and they can be run with the command:
`mocha -u tdd -R spec qa/tests-api.js`

# Testing the live app
* The app is deployed on Heroku and the following link is the app's URL: https://via-trailers.herokuapp.com/api/trailer
* For easier testing of live app import Postman collection from the following link: https://www.getpostman.com/collections/297b276bda09e55aa0a3


 :movie_camera: