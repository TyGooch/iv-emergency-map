import React from 'react';
import ReactDOM from 'react-dom';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import axios from 'axios';

const google = window.google;
let geocoder = new google.maps.Geocoder();


const coords = {
  lat: 34.4110,
  lng: -119.8610
};

const params = {v: '3.exp', key: process.env.GOOGLE_MAPS_KEY};

export default class EmergencyMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        data: [],
        markers: [],
    }
    this.loadEmergenciesFromServer = this.loadEmergenciesFromServer.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
  }

  loadEmergenciesFromServer() {
    console.log(this.state.markers);
   axios.get('http://localhost:3001/api/emergencies')
     .then(res => {
       if( this.state.data.length !== res.data.length ){
         var newData = res.data.filter(emergency => this.state.data.indexOf(emergency) < 0);
         this.createMarkers(newData);
         this.setState({ data: res.data });
       }
     }
   )
 }

  createMarkers(emergencies) {
    // console.log(this.state.markers);
    emergencies.forEach(emergency => {
      geocoder.geocode( { 'address': emergency.address + ' Isla Vista, CA' }, (results, status) => {
        if (status === "OK"){
          var position = results[0].geometry.location;
          this.setState({ markers: this.state.markers.concat([{lat: position.lat(), lng: position.lng(), address: emergency.address, description: emergency.description, time: emergency.time, key: emergency['_id'] }])});
        }
      })
    })
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }
  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  componentDidMount(){
    this.loadEmergenciesFromServer();
    console.log(this.state.data);
    // this.createMarkers();
    setInterval(this.loadEmergenciesFromServer, 2000)
  }

  render() {
    return (
      <Gmaps
        width={'800px'}
        height={'600px'}
        lat={coords.lat}
        lng={coords.lng}
        zoom={15}
        loadingMessage={'Loading...'}
        params={params}
        onMapCreated={this.onMapCreated}
      >
        {this.state.markers.map((marker, i) =>{
            return(
              <Marker
                lat={marker.lat}
                lng={marker.lng}
              />
            )
          })}
        {this.state.markers.map((marker, i) =>{
            return(
              <InfoWindow
                lat={marker.lat}
                lng={marker.lng}
                content={
                  '<div class="infoContent">' +
                    '<h3 class="emergencyTitle">' + marker.address + '</h3>' +
                    '<div class="infoBody">' +
                      '<div class="infoTime"><b>' + marker.time + '</b></div>' +
                      '<div class="infoDescription"><p>' + marker.description + '</p></div>' +
                    '</div>' +
                  '</div>'
                }
                onCloseClick={this.onCloseClick}
                onClick={this.onClick}
              />
            )
          })}

      </Gmaps>
    );
  }

};
