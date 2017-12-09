import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const google = window.google;

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
    this.timeAgo = this.timeAgo.bind(this);
  }

  componentDidMount() {
    const map = ReactDOM.findDOMNode(this.refs.map)

    const options = {
      center: { lat: 34.4110, lng: -119.8610 },
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true
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
    if(this.state.markers.length >= 10){
      this.state.markers.slice(-(emergencies.length)).forEach(marker => { marker.setMap(null)});
    }
    emergencies.forEach(this.createMarker);
  }

  createMarker(emergency) {
    const pos = new google.maps.LatLng(emergency.position.lat, emergency.position.lng);
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map
    });
    var infowindow = this.infowindow;
    if(emergency.description.includes("Vehicle Acc")) {
      emergency.description = "Vehicle Accident";
    }
    var contentString = '<div><h3>' + emergency.address + '</h3><p>' + this.timeAgo(emergency.time) + '<br>' + emergency.description + '</p></div>'

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

    timeAgo(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);

        var diff = rightNow - then;

        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;

        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }

        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }

        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }

        if (diff < minute * 2) {
            return "about 1 minute ago";
        }

        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }

        if (diff < hour * 2) {
            return "about 1 hour ago";
        }

        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }

        if (diff > day && diff < day * 2) {
            return "yesterday";
        }

        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }

        else {
            return "over a year ago";
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
