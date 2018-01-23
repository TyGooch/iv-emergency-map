//server.js
'use strict'

var express = require('express');
const path = require('path');
var axios = require('axios');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var titleCase = require('title-case');
var Emergency = require('./model/emergencies');
var allTweets = require('./seed/sbcfiredispatch');
const StreamArray = require('stream-json/utils/StreamArray');
const {Writable} = require('stream');
const fs = require('fs');

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCW4K_gNy_TFkFV_na57dlPq_6SUx79jbk'
  // key: 'AIzaSyBtgC58B0isrlltVen4jevBhE94_Ln1l0M'
});

var googleMapsClient2 = require('@google/maps').createClient({
  key: 'AIzaSyDxXp0QWl8LUxcQCPTcDxDMF6QiEqCDgxw'
});

var googleMapsClient3 = require('@google/maps').createClient({
  key: 'AIzaSyALtxkemTJOWaklVph6Dnr4fGFfTFnYbk8'
});

var googleMapsClient4 = require('@google/maps').createClient({
  key: 'AIzaSyAFIDWfJfT9_1bhUeLPlFuBP7OvkM68xRY'
});

var googleMapsClient5 = require('@google/maps').createClient({
  key: 'AIzaSyD4Ocu4CoevIb5scGhpo7EdbC-jhhmA6Lg'
});

var googleMapsRoadClient = require('@google/maps').createClient({
  // key: 'AIzaSyAj8iADlAHisr8IPmKZ6jHu3ZSwYHx0OhA'
  // key: 'AIzaSyDRXRzNHa4RihImuLUHJzZS_UwOyItOyiM'
  key: 'AIzaSyAF5auIS2756TXwxMN2vSFJx5aTA8iPJ3s'
});

var googleMapsDirectionsClient = require('@google/maps').createClient({
  key: 'AIzaSyDX43_TuR8xh37ZVRriHL-5q72ZcCnr_2M'
});

var googleMapsClients = [googleMapsClient, googleMapsClient2, googleMapsClient3, googleMapsClient4, googleMapsClient5];
var currentGoogleMapsClient = googleMapsClients[0];

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
        var text = tweet.text.replace('Page ', '').replace(/\*/g, '');
        var address = text.slice(0,text.indexOf('Isla')).trim().replace(' ,', '').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var start = text.indexOf('Vista') + 6;
        var endMatch = text.match(/\s\d{3,99}/);
        var end = text.indexOf(endMatch);
        var description = text.slice(start, end).trim();
        var time = tweet.created_at;

        // Account for incomplete addresses/street corners
        if(address.includes('/')){
          address = address.replace('/', '&')
        }

        if(address.includes('-blk')){
          address = address.replace('-blk', ' Block');
          address = address.replace('00', '50');
        }

        if(address[0] === '0'){
          address = address.slice('2');
        }

        description = description.replace(',', '');
        description = description.replace(' Inside', '');
        description = description.replace('- Defau', '').trim();
        description = description.replace(' - All', '');
        description = description.replace('-Away', '');
        description = description.replace('Lines down', 'Power Lines Down');
        description = description.replace('Alarm-Fire / Co Detector', 'Alarm - Fire/CO Detector');
        description = description.replace('C3ECHO', 'Critical Medical Emergency');
        description = description.replace('Code 2 Medical', 'Medical Emergency - Code 2');

        if(description.includes('Fire-')){
          description = description.replace('Fire-', '');
          description = description.concat(' Fire');
        }

        // Geocode address and save it to db
        googleMapsClient.geocode({
          address: address + ', Isla Vista, CA'
        }, function(err, response) {
          if (!err) {
            var pos = []
            pos[0] = response.json.results[0].geometry.location.lat;
            pos[1] = response.json.results[0].geometry.location.lng;
            var pos = response.json.results[0].geometry.location;

            if(address.includes('Sabado')){
              pos.lat = 34.410442;
            } else if(address.includes('Trigo')){
              pos.lat = 34.411155;
            } else if(address.includes('Embarcadero Del Norte')){
              pos.lng = -119.85539;
            } else if(address.includes('Embarcadero Del Mar')){
              pos.lng = -119.857041;
            } else if(address.includes('Camino Pescadero')){
              pos.lng = -119.858688;
            } else if(address.includes('Camino Del Sur')){
              pos.lng =  -119.862574;
            } else if(address.includes('Camino Corto')){
              pos.lng =  -119.866396;
            } else if(address.includes('Fortuna Ln')){
              pos.lng = -119.866901;
            } else if(address.includes('Camino Lindo')){
              pos.lng = -119.867995;
            } else if(address.includes('Camino Majorca')){
              pos.lng = -119.86954;
            } else if(address.includes('Abrego')){
              pos.lat = 34.414593 ;
            } else if(address.includes('Pardall')){
              pos.lat = 34.413118 ;
            } else if(address.includes('Del Playa') && parseInt(address.substr(0,4)) < 6519){
              pos.lat =  34.409092;
            } else if(address.includes('Del Playa') && parseInt(address.substr(0,4)) >= 6600){
              pos.lat =  34.40976;
            } else if(address.includes('Cervantes')){
              pos.lat =  34.416424;
            } else if(address.includes('El Colegio') && parseInt(address.substr(0,4)) % 2 === 1){
              pos.lat = 34.417297;
            } else if(address.includes('El Colegio') && parseInt(address.substr(0,4)) % 2 === 0){
              pos.lat =  34.417487;
            } else if(address.includes('El Nido')){
              pos.lat = 34.409784;
            } else if(address.includes('Seville')){
              pos.lat =  34.411813;
            } else if(address.includes('El Greco')){
              pos.lat =  34.415736;
            } else if(address.includes('Picasso')){
              pos.lat =  34.4151;
            } else if(address.includes('Segovia')){
              pos.lat =  34.414432;
            } else if(address.includes('Cordoba')){
              pos.lat =  34.413769;
            } else if(address.includes('Madrid')){
              pos.lat =  34.412447;
            }

            googleMapsRoadClient.snapToRoads({
              path: pos
            }, function(err, response) {
              if (!err) {
                var position = response.json.snappedPoints[0].location.latitude;
                var pos = {};
                pos.lat = response.json.snappedPoints[0].location.latitude;
                pos.lng = response.json.snappedPoints[0].location.longitude;


                if(address.includes('Block')){
                  address = address.replace('50', '00');
                } else if(!address.includes('&') && !address.includes('00') && !description.includes('Vehicle')){
                  var num = parseInt(address.substr(0,4))
                  if( num >= 1000 ){
                    if(num % 2 === 0){
                      pos.lat = pos.lat + 0.00017;
                    } else{
                      pos.lat = pos.lat - 0.00017;
                    }
                  } else{
                    if(num % 2 === 0){
                      pos.lng = pos.lng + 0.0002;
                    } else{
                      pos.lng = pos.lng - 0.0002;
                    }
                  }
                }
                var emergency = { "address": address, "position": pos, "description": description, "time": time};

                axios.post(`http://${host}:${port}/api/emergencies`, emergency)
                .then(res => {
                  console.log(`Successfully saved`);;
                })
                .catch(err => {
                  console.error(err);
                });
              }
              else{
                console.log(err);
              }
            });
          }
        });
      }
    });
  });
}

let fileStream = fs.createReadStream(path.join(__dirname, './seed/allTweets.json'));
let jsonStream = StreamArray.make();

let processingStream = new Writable({
	write(object, encoding, callback) {
		//Save to mongo or do any other async actions
    if(object.value.text.includes("Isla Vista")){
      var text = object.value.text.replace('Page ', '').replace(/\*/g, '');
      var address = text.slice(0,text.indexOf('Isla')).trim().replace(' ,', '').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      var start = text.indexOf('Vista') + 6;
      var endMatch = text.match(/\s\d{3,99}/);
      var end = text.indexOf(endMatch);
      var description = text.slice(start, end).trim();
      var time = object.value.created_at;

      // Account for incomplete addresses/street corners
      if(address.includes('/')){
        address = address.replace('/', '&')
      }

      if(address.includes('-blk')){
        address = address.replace('-blk', ' Block');
        address = address.replace('00', '50');
      }

      if(address[0] === '0'){
        address = address.slice('2');
      }

      description = description.replace(',', '');
      description = description.replace(' Inside', '');
      description = description.replace('- Defau', '').trim();
      description = description.replace(' - All', '');
      description = description.replace('-Away', '');
      description = description.replace('Lines down', 'Power Lines Down');
      description = description.replace('Alarm-Fire / Co Detector', 'Alarm - Fire/CO Detector');
      description = description.replace('C3ECHO', 'Medical Emergency - Critical');
      description = description.replace('WALKIN', 'Walk-In');
      description = description.replace('Code 2 Medical', 'Medical Emergency - Code 2');

      if(description.includes('Fire-')){
        if(description.includes('Out')){
          description = description.replace('Fire-', 'Fire');
        } else{
          description = description.replace('Fire-', '');
          description = description.concat(' Fire');
        }
      }

      // var port = process.env.PORT || 8080;
      // var host = process.env.HOST || '0.0.0.0';

      // console.log('');
      // console.log(address);
      // console.log(description);
      // console.log('');

      var googleClientIdx = googleMapsClients.indexOf(currentGoogleMapsClient);
      currentGoogleMapsClient = googleMapsClients[(googleClientIdx + 1) % 5];

      currentGoogleMapsClient.geocode({
        address: address + ', Isla Vista, CA'
      }, function(err, response) {
        if (!err) {
          var pos = []
          pos[0] = response.json.results[0].geometry.location.lat;
          pos[1] = response.json.results[0].geometry.location.lng;
          var pos = response.json.results[0].geometry.location;

          if(address.includes('Sabado')){
            pos.lat = 34.410442;
          } else if(address.includes('Trigo')){
            pos.lat = 34.411155;
          } else if(address.includes('Embarcadero Del Norte')){
            pos.lng = -119.85539;
          } else if(address.includes('Embarcadero Del Mar')){
            pos.lng = -119.857041;
          } else if(address.includes('Camino Pescadero')){
            pos.lng = -119.858688;
          } else if(address.includes('Camino Del Sur')){
            pos.lng =  -119.862574;
          } else if(address.includes('Camino Corto')){
            pos.lng =  -119.866396;
          } else if(address.includes('Fortuna Ln')){
            pos.lng = -119.866901;
          } else if(address.includes('Camino Lindo')){
            pos.lng = -119.867995;
          } else if(address.includes('Camino Majorca')){
            pos.lng = -119.86954;
          } else if(address.includes('Abrego')){
            pos.lat = 34.414593 ;
          } else if(address.includes('Pardall')){
            pos.lat = 34.413118 ;
          } else if(address.includes('Del Playa') && parseInt(address.substr(0,4)) < 6519){
            pos.lat =  34.409092;
          } else if(address.includes('Del Playa') && parseInt(address.substr(0,4)) >= 6600){
            pos.lat =  34.40976;
          } else if(address.includes('Cervantes')){
            pos.lat =  34.416424;
          } else if(address.includes('El Colegio') && parseInt(address.substr(0,4)) % 2 === 1){
            pos.lat = 34.417297;
          } else if(address.includes('El Colegio') && parseInt(address.substr(0,4)) % 2 === 0){
            pos.lat =  34.417487;
          } else if(address.includes('El Nido')){
            pos.lat = 34.409784;
          } else if(address.includes('Seville')){
            pos.lat =  34.411813;
          } else if(address.includes('El Greco')){
            pos.lat =  34.415736;
          } else if(address.includes('Picasso')){
            pos.lat =  34.4151;
          } else if(address.includes('Segovia')){
            pos.lat =  34.414432;
          } else if(address.includes('Cordoba')){
            pos.lat =  34.413769;
          } else if(address.includes('Madrid')){
            pos.lat =  34.412447;
          }

          googleMapsRoadClient.snapToRoads({
            path: pos
          }, function(err, response) {
            if (!err) {
              var position = response.json.snappedPoints[0].location.latitude;
              var pos = {};
              pos.lat = response.json.snappedPoints[0].location.latitude;
              pos.lng = response.json.snappedPoints[0].location.longitude;


              if(address.includes('Block')){
                address = address.replace('50', '00');
              } else if(!address.includes('&') && !address.includes('00') && !description.includes('Vehicle')){
                var num = parseInt(address.substr(0,4))
                if( num >= 1000 ){
                  if(num % 2 === 0){
                    // pos.lat = pos.lat + 0.000115;
                    // pos.lat = pos.lat + 0.00012;
                    pos.lat = pos.lat + 0.00017;
                  } else{
                    // pos.lat = pos.lat - 0.000115;
                    // pos.lat = pos.lat - 0.00012;
                    pos.lat = pos.lat - 0.00017;
                  }
                } else{
                  if(num % 2 === 0){
                    pos.lng = pos.lng + 0.0002;
                  } else{
                    pos.lng = pos.lng - 0.0002;
                  }
                }
              }
              var emergency = { "address": address, "position": pos, "description": description, "time": time};
              axios.post(`http://${host}:${port}/api/emergencies`, emergency)
              .then(res => {
                console.log(`Successfully saved`);;
              })
              .catch(err => {
                console.error(err);
              });
            }
            else{
              console.log(err);
            }
          });
        }
      });
    }
		setTimeout(() => {
			// console.log('done');
			//Next record will be read only current one is fully processed
			callback();
		}, 50);
	},
	//Don't skip this, as we need to operate with objects, not buffers
	objectMode: true
});


function seedDb(){

  //Pipe the streams as follows
  fileStream.pipe(jsonStream.input);
  jsonStream.output.pipe(processingStream);

  //So we're waiting for the 'finish' event when everything is done.
  processingStream.on('finish', () => console.log('All done'));
}

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 8080
var port = process.env.PORT || 8080;
var host = process.env.HOST || '0.0.0.0';

//db config
// var mongoDB = `mongodb://admin:admin@ds035683.mlab.com:35683/iv-emergency-map`;
// var mongoDB = `mongodb://admin:admin@ds239387.mlab.com:39387/isla-vista-emergencies`;
// var mongoDB = `mongodb://admin:admin@ds249737.mlab.com:49737/emergencies-test`;
var mongoDB = `mongodb://admin:admin@ds111618.mlab.com:11618/iv-emergencies`;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/emergencies/', function(req, res) {
  //looks at our Emergency Schema
  // Emergency.find({}, {sort:{time:-1}}, function(err, emergencies) {
  var q = Emergency.find().sort({time: 1});
  q.exec(function(err, emergencies) {
    if (err)
      res.send(err);
    //responds with a json object of our database emergencies.
    res.json(emergencies)
  });
})

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
  // getTweets();
  seedDb();
  console.log(`api running on port ${port}`);
  console.log(`host running on ${host}`);
});
