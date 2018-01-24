Description
REST API for providing clients with trailer URLs. 

The API takes a movie resource link (e.g. https://content.viaplay.se/pc-se/film/arrival-2016) in a body of POST request and returns the URLs of the trailers that are stored in movidedb.


# RESTful API

__POST */api/trailer*__
	Takes Viaplay Movie Resource Example Link in the request body.

	Returns an array of movie trailers.


Links
Viaplay Content API
http://content.viaplay.se/pc-se/film
Viaplay Movie Resource Example Link
https://content.viaplay.se/pc-se/film/arrival-2016
TMDb API
https://www.themoviedb.org/documentation/api
Example Link That Your API Should Respond With
https://www.youtube.com/watch?v=AMgyWT075KY