require("dotenv").config();

let request = require("request");

const keys = require("./keys.js");

const Spotify = require("node-spotify-api");

const spotify = new Spotify(keys.spotify);

const axios = require("axios");

const moment = require("moment");

const fs = require("fs");

const omdb = (keys.omdb);

const bands = (keys.bandsintown);

let command = process.argv[2];


let userQuery = process.argv.slice(3).join(" ");

//switch statement 
function userCommand(command, userQuery) {
  switch (command) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this-song":
      spotifyThis();
      break;
    case "movie-this":
      movieThis(userQuery);
      break;
    case "do-what-it-says":
      doThis(userQuery);
      break;
    default:
      console.log("I don't understand, Please try again");
      break;
  }
};

userCommand(command, userQuery);

//bandsInTown query
let concertURL = ("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp")
axios.get(concertURL)
function concertThis() {
  console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);
  // USE REQUEST AS OUR QUERY URL USING OUR USER QUERY VARIABLE AS THE PARAMETERS OF OUR SEARCH
  request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bands, function (error, response, body) {
    // IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
    if (!error && response.statusCode === 200) {
      // CAPTURE DATA AND USE JSON TO FORMAT
      let userBand = JSON.parse(body);
      // PARSE DATA AND USE FOR LOOP TO ACCESS PATHS TO DATA
      if (userBand.length > 0) {
        for (i = 0; i < 1; i++) {

          // CONSOLE DESIRED DATA USING E6 SYNTAX
          console.log(`\nBAM! Here you go...\n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)

          // MOMENT.JS TO FORMAT THE DATE MM/DD/YYYY
          let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
          console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
        };
      } else {
        console.log('Band or concert not found!');
      };
    };
  });
};

//Spotify query
function spotifyThis() {

  if (!userQuery) {
    userQuery = "The Sign Ace of Base";
  };

  spotify.search({
    type: 'track',
    query: userQuery,
    limit: 1
  }, function (error, data) {
    if (error) {
      return console.log("Error occurred: " + error);
    }
    let spotifyArr = data.tracks.items;
    for (var i = 0; i < spotifyArr.length; i++) {
      console.log(`\nBAM! Here you go...\n\nArtist: ${data.tracks.items[i].album.artists[0].name}\nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n-----`)
    };
  });
}

//OMDB query
function movieThis(userQuery) {
  console.log(userQuery)
  
  let movieName = "";

  if (!userQuery) {
    movieName = "Mr. Nobody";
  }
  else {
  //   for (var i = 3; i < process.argv.length; i++) {
 
  //   if (i > 3 && i < process.argv.length) {
  //     movieName = movieName + "+" + process.argv[i];
  //   }
  //   else {
  //     movieName += process.argv[i];

  //   }
  // }
  movieName = userQuery;
  }
    console.log(movieName);
    let movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // let ratingsArr = response.data.Ratings;
    // if (ratingsArr.length > 2) { };

    axios.get(movieURL).then(function (response) {
      // console.log('Your command is: ' + command)
      // console.log('userQuery is: ' + userQuery)
      // console.log ("This is your movie name: " + movieName)
    console.log(`\nBAM! Here you go...\n\nTitle: ${response.data.Title}\nRelease year: ${response.data.Year}\nIMDB Rating: 
                  ${response.data.Rated}\nActors: ${response.data.Actors}\nProduced in: 
                  ${response.data.Country}\nLanguage: ${response.data.Language}\n
                  Plot: ${response.data.Plot}`);
    console.log('End!')
      // console.log("Title: " + response.data.Title);
      // console.log("Release year: " + response.data.Year);
      // console.log("IMDB Rating: " + response.data.Rated);
      // console.log("Actors: " + response.data.Actors);
      // console.log("Produced in: " + response.data.Country);
      // console.log("Language: " + response.data.Language);
      // console.log("Plot: " + response.data.Plot);
      // console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
    }).catch(error => {
      console.log(error)
    });
  }





//DoThis function
function doThis() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    let dataArr = data.split(",");
    command = dataArr[0];
    userQuery = dataArr[1];
    userCommand(command, userQuery);
  });
};