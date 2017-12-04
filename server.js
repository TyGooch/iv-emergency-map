//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var axios = require('axios');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var Emergency = require('./model/emergencies');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SERCRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function getTweets(){
  console.log('getTweets');
  client.stream('user', {track: 'TyBradleyGooch'}, function(stream) {
    stream.on('data', function(tweet) {
      if(JSON.stringify(tweet).includes("Isla Vista")){
        var text = JSON.stringify(tweet.text);
        var address = text.slice(6,text.indexOf(' ,'));
        var start = text.indexOf('*') + 1;
        var end = text.indexOf('*', start);
        var description = text.slice(start, end);
        var time = JSON.stringify(tweet.created_at);
        console.log(address);
        console.log(description);
        console.log(time);
        var result = { "address": address, "description": description, "time": time};

        axios.post('http://localhost:3001/api/emergencies', result)
        .then(res => {
          console.log("Successfully saved");;
        })
        .catch(err => {
          console.error(err);
        });
      }
    });
  });
}

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

//db config
var mongoDB = `mongodb://admin:admin@ds035683.mlab.com:35683/iv-emergency-map`;
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent emergencies
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /emergencies route to our /api router
router.route('/emergencies')
  //retrieve all emergencies from the database
  .get(function(req, res) {
    //looks at our Emergency Schema
    Emergency.find(function(err, emergencies) {
      if (err)
        res.send(err);
      //responds with a json object of our database emergencies.
      res.json(emergencies)
    });
  })
  //post new emergency to the database
  .post(function(req, res) {
    var emergency = new Emergency();
    //body parser lets us use the req.body
    emergency.address = req.body.address;
    emergency.description = req.body.description;
    emergency.time = req.body.time;

    emergency.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Emergency successfully added!' });
    });
  });


//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  // populateTweets();
  getTweets();
  console.log(`api running on port ${port}`);
});
