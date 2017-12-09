import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const google = window.google;

// const mapCenter = { lat: 34.4110, lng: -119.8610 };

// I made some lat/lng points for some good burrito spots
// const burritos = [
//   { lat: 37.775785, lng: -122.445979, name: "Papalote" },
//   { lat: 37.772045, lng: -122.437015, name: "The Little Chihuahua" },
//   { lat: 37.781899, lng: -122.410426, name: "Cancun" }
// ];

// just a normal react component class :)
export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        emergencies: [],
        markers: []
    }
    this.loadEmergenciesFromServer = this.loadEmergenciesFromServer.bind(this);
    this.initializeState = this.initializeState.bind(this);
    this.createMarker = this.createMarker.bind(this);
  }

  componentDidMount() {
    const map = ReactDOM.findDOMNode(this.refs.map)

    const options = {
      center: { lat: 34.4110, lng: -119.8610 },
      zoom: 15
    };
    this.map = new google.maps.Map(map, options);
    this.infowindow = new google.maps.InfoWindow({
      content: ''
    });

    this.initializeState();

    // close infowindow on click out
    var infowindow = this.infowindow;
    this.map.addListener('click', function() {
      infowindow.close();
    })

    setInterval(this.loadEmergenciesFromServer, 2000);
  }

  loadEmergenciesFromServer() {
     axios.get('http://localhost:3001/api/emergencies')
       .then(res => {
         if( this.state.emergencies[0]._id !== res.data[0]._id ){
           console.log("in");
           var newEmergencies = res.data.filter(emergency => this.state.emergencies.indexOf(emergency) < 0);
           this.createMarkers(newEmergencies);
           this.setState({ emergencies: res.data });
         }
       }
     )
   }

  initializeState() {
     axios.get('http://localhost:3001/api/emergencies')
       .then(res => {
           this.createMarkers(res.data);
           this.setState({ emergencies: res.data });
       }
     )
   }

  createMarkers(emergencies) {
    console.log(this.state.markers);
    if(this.state.markers.length >= 10){
      this.state.markers.slice(-(emergencies.length)).forEach(marker => { marker.setMap(null)});
    }
    emergencies.forEach(this.createMarker);
  }
  //
  // handleMarkerClick(emergency, marker) {
  //   this.infowindow.close();
  //   this.infowindow.open(this.map, marker);
  // }

  createMarker(emergency) {
    const pos = new google.maps.LatLng(emergency.position.lat, emergency.position.lng);
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map
    });
    var infowindow = this.infowindow;

    var contentString = '<div><h3>' + emergency.address + '</h3><p>' + emergency.time + '<br>' + emergency.description + '</p></div>'

    marker.addListener('click', function() {
      infowindow.setContent(contentString);
      infowindow.open(this.map, this);
    });

    if(this.state.markers.length <= 9){
      this.setState({markers: this.state.markers.concat([marker])});
    } else {
      this.setState({markers: this.state.markers.slice(0,8).concat([marker])});
    }
  }

  render() {
    return (
      <div>
        <div id='map' ref='map'/>
      </div>
    );
  }
}
