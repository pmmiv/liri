require("dotenv").config();

//code required to import the keys.js file and store it in a variable
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function run (a, b) {
	var command = a;
	function searchTerm () {
		if (b === undefined) {
			return "The Sign Ace of Base"
		} else {
			return b
		}
	}

	if (command == "my-tweets") {
		var params = {screen_name: 'roustonhockets'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		  	for (var key in tweets) {
			  console.log("\r\n" + tweets[key].created_at)
			  console.log(tweets[key].text)
			}
		  } else {
		  	console.log(error);
		  }
		});
	} else if (command == "spotify-this-song") {
		spotify.search({type: 'track', query: searchTerm(), limit: 3}, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}	

			for (i=0; i<data.tracks.items.length; i++) {
				var album = data.tracks.items[i].album
				var song = data.tracks.items[i]
				var artists = [];
				for (j=0;j<song.artists.length;j++) {
					artists.push(song.artists[j].name);
				}
				console.log("\r\nTrack: " + song.name);
				console.log("Artists: " + artists);
				console.log("Album: " + album.name);
				console.log("Track: " + song.track_number);
				console.log("Listen: " + song.preview_url);
			}
		});
	} else if (command == "movie-this") {
		var movie = process.argv[3].split(' ').join('+');
		request('http://www.omdbapi.com/?t='+movie+'&apikey=da4ec55e', function (error, response, body) {
			if (!error) {
				var obj = JSON.parse(body);
	  			console.log("\r\nTitle: "+obj.Title+"\r\nYear: "+obj.Year+"\r\n"+obj.Ratings[0].Source+" rating: "+obj.Ratings[0].Value +"\r\n"+obj.Ratings[1].Source+" rating: "+obj.Ratings[1].Value +"\r\nCountry: "+obj.Country+"\r\nPlot: "+obj.Plot+"\r\nCast: "+obj.Actors); 
			} else {
				console.log(error)
			}
		});

	} else if (command == "surprise-me") {
		    fs.readFile("random.txt", "utf8", function(error, data) {
		      console.log("node liri.js" + data);

		      var args = data.split(', ');
		      run (args[0], args[1])

		    });

	} else {
		console.log("I'm sorry. I only understand the following commands.\r\n  1) my-tweets\r\n  2) spotify-this-song \r\n  3) movie-this\r\n  4) surprise-me");
	}
}

run (process.argv[2], process.argv[3]);
