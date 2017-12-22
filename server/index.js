//server.js
'use strict'

var express = require('express');
var path = require('path');
var axios = require('axios');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var Emergency = require('./model/emergencies');

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCW4K_gNy_TFkFV_na57dlPq_6SUx79jbk'
});

// var client = new Twitter({
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SERCRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });
var client = new Twitter({
  consumer_key: 'tLXXvzyhVn9asv5eJsryx6Sbh',
  consumer_secret: 'ACDAmsDfFRayLe7tCRXKOu9FR8FDBI4NUxBcehbUmTK09ouxBY',
  access_token_key: '2500408164-WP3f2wkVYYdXChTTxs7ssOu4z8o65sa7XhRMLa9',
  access_token_secret: '4XOV4gQTwvlNYM1e5wD0mjht8ccd3xCX0pPISPEqcHY5w'
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
        var time = tweet.created_at;

        // Account for incomplete addresses/street corners
        if(address.includes('/')){
          address = address.replace('/', '&')
        }

        var port = process.env.PORT || 8080;
        var host = process.env.HOST || '0.0.0.0';
        // Geocode address and save it to db
        googleMapsClient.geocode({
          address: address + ' Isla Vista, CA'
        }, function(err, response) {
          if (!err) {
            var position = response.json.results[0].geometry.location;
            var emergency = { "address": address, "position": position, "description": description, "time": time};
            axios.post(`http://${host}:${port}/api/emergencies`, emergency)
            .then(res => {
              console.log("Successfully saved");;
            })
            .catch(err => {
              console.error(err);
            });
          }
        });
      }
    });
  });
}

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 8080
var port = process.env.PORT || 8080;
var host = process.env.HOST || '0.0.0.0';

//db config
var mongoDB = `mongodb://admin:admin@ds035683.mlab.com:35683/iv-emergency-map`;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//
//   // remove cacheing
//   res.setHeader('Cache-Control', 'no-cache');
//   next();
// });

// app.get('*', function(request, response) {
//   response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

// router.get('/', function(req, res) {
//   res.json({ message: 'API Initialized!'});
// });

app.get('/api/emergencies', function(req, res) {
  //looks at our Emergency Schema
  Emergency.find(function(err, emergencies) {
    if (err)
      res.send(err);
    //responds with a json object of our database emergencies.
    res.json(emergencies)
  });
})

// app.get('/api/emergencies/:description/:startDate/:endDate/:limit', function(req, res) {
//   //looks at our Emergency Schema
//   var description = req.params.description;
//   var startDate = req.params.startDate;
//   var endDate = req.params.endDate;
//   var limit = req.params.limit;
//
//   Emergency.
//     find({ occupation: /host/ }).
//     where('name.last').equals('Ghost').
//     where('age').gt(17).lt(66).
//     where('likes').in(['vaporizing', 'talking']).
//     limit(10).
//     sort('-occupation').
//     select('name occupation').
//     exec(callback);
//
//   Emergency.find(function(err, emergencies) {
//     if (err)
//       res.send(err);
//     //responds with a json object of our database emergencies.
//     res.json(emergencies)
//   });
// })

app.post('/api/emergencies', function(req, res) {
  var emergency = new Emergency();
  emergency.address = req.body.address;
  emergency.position = req.body.position;
  emergency.description = req.body.description;
  emergency.time = req.body.time;

  emergency.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Emergency successfully added!' });
  });
});

// router.route('/emergencies')
//   //retrieve all emergencies from the database
//   .get(function(req, res) {
//     //looks at our Emergency Schema
//     Emergency.find(function(err, emergencies) {
//       if (err)
//         res.send(err);
//       //responds with a json object of our database emergencies.
//       res.json(emergencies)
//     });
//   })
//   .post(function(req, res) {
//     var emergency = new Emergency();
//     emergency.address = req.body.address;
//     emergency.position = req.body.position;
//     emergency.description = req.body.description;
//     emergency.time = req.body.time;
//
//     emergency.save(function(err) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'Emergency successfully added!' });
//     });
//   });

  // router.route('/emergencies/latest')
  //   //retrieve latest 10 emergencies from db
  //   .get(function(req, res) {
  //     var q = Emergency.find().sort({time: -1}).limit(10);
  //     q.exec(function(err, emergencies) {
  //       if (err)
  //         res.send(err);
  //       //responds with a json object of our database emergencies.
  //       res.json(emergencies)
  //     })
  //   })
  //
    app.get('/api/emergencies/latest', function(req, res) {
      var q = Emergency.find().sort({time: -1}).limit(10);
      q.exec(function(err, emergencies) {
        if (err)
          res.send(err);
        //responds with a json object of our database emergencies.
        res.json(emergencies)
      })
    });

//Use router config when making calls to /api
// app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(port, host, function() {
  getTweets();
  console.log(`api running on port ${port}`);
  console.log(`host running on ${host}`);
});
