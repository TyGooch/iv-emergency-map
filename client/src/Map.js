import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {mapStyle} from './mapStyle.js';

const google = window.google;
// baseUrl = process.env.baseURL || "http://localhost:3001"

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
    this.getIconUrl = this.getIconUrl.bind(this);
    this.parseTime = this.parseTime.bind(this);
  }

  componentDidMount() {
    this.axiosInstance = axios.create({
      baseURL: process.env.BASE_URL
    });
    const map = ReactDOM.findDOMNode(this.refs.map)

    const options = {
      center: { lat: 34.4110, lng: -119.8610 },
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true
    };

    var styledMapType = new google.maps.StyledMapType(mapStyle, {name: "Styled Map"});
    this.map = new google.maps.Map(map, options);
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');

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
     // axios.get('/api/emergencies')
     // axios.request({
     //   method: 'get',
     //   url: `http://localhost:3100/api/emergencies/latest`
     // }).then(res => {
         // if( this.state.emergencies[0]._id !== res.data[0]._id ){
         //   var newEmergencies = res.data.filter(emergency => this.state.emergencies.indexOf(emergency) < 0);
         //   this.createMarkers(newEmergencies);
         //   this.setState({ emergencies: res.data });
     //     }
     //   }
     // )

     fetch('/api/emergencies/latest')
       .then(response => {
         if (!response.ok) {
           throw new Error(`status ${response.status}`);
         }
         return response.json();
       })
       .then(emergencies => {
         if( this.state.emergencies[0]._id !== emergencies[0]._id ){
           var newEmergencies = emergencies.filter(emergency => this.state.emergencies.indexOf(emergency) < 0);
           this.createMarkers(newEmergencies);
           this.setState({ emergencies: emergencies });
         }
       }).catch(e => {
         this.setState({
           emergencies: `API call failed: ${e}`,
         });
       })
   }

  initializeState() {
    // axios.request({
    //   method: 'get',
    //   url: `http://localhost:3100/api/emergencies/latest`
    // }).then(res => {
           // this.createMarkers(res.data);
    //        this.setState({ emergencies: res.data });
    //    }
    //  )
    fetch('/api/emergencies/latest')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(emergencies => {
        this.createMarkers(emergencies);
        this.setState({
          emergencies: emergencies
        });
      }).catch(e => {
        console.log(e);
        this.setState({
          emergencies: `API call failed: ${e}`,
        });
      })
   }

  createMarkers(emergencies) {
    if(this.state.markers.length >= 10){
      this.state.markers.slice(-(emergencies.length)).forEach(marker => { marker.setMap(null)});
    }
    emergencies.forEach(this.createMarker);
  }

  createMarker(emergency) {
    const pos = new google.maps.LatLng(emergency.position.lat, emergency.position.lng);
    const iconUrl = this.getIconUrl(emergency);
    var icon = {
      url: iconUrl, // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      icon: icon
    });

    var infowindow = this.infowindow;
    if(emergency.description.includes("Vehicle Acc")) {
      emergency.description = "Vehicle Accident";
    }

    marker.addListener('click', function() {
      var time = new Date(emergency.time).toString();
      time = time.slice(0, -15);

      var contentString = '<div><h3>' + emergency.description + '</h3><p>' + time.slice(0,-9) + '<br>' + time.slice(-9) + '<br>' + emergency.address + '</p></div>'
      infowindow.setContent(contentString);
      infowindow.open(this.map, this);
    });

    if(this.state.markers.length <= 9){
      this.setState({markers: this.state.markers.concat([marker])});
    } else {
      this.setState({markers: this.state.markers.slice(0,8).concat([marker])});
    }
  }

  getIconUrl(emergency) {
    var description = emergency.description;
    if(description.includes("Medical")) {
      return "https://image.ibb.co/eSAspm/medical_Icon5.png";
    } else if(description.includes("Fire")) {
      return "https://image.ibb.co/mgbF9m/fire_Icon2.png";
    } else if(description.includes("Vehicle Acc")) {
      return "https://image.ibb.co/dbg1FR/accident_Icon2.png";
    } else {
      return "https://image.ibb.co/cdGbFR/alert_Icon.png";
    }
  }

  showHeatMap() {
    var heatMapData = [];
    this.state.emergencies.forEach(emergency => {
      heatMapData.push(new google.maps.LatLng(emergency.position.lat, emergency.position.lng))
    });
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.state.markers
    });
    heatmap.setMap(this.map);
  }

  parseTime(dateString) {
    var rightNow = new Date();
    var then = new Date(dateString);

    var diff = rightNow - then;

    var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

    if (isNaN(diff) || diff < 0) {
        return ""; // return blank string if unknown
    }

    if (diff < second * 2) {
        // within 2 seconds
        return "Right Now";
    }

    if (diff < minute) {
        return Math.floor(diff / second) + " seconds ago";
    }

    if (diff < minute * 2) {
        return "About 1 minute ago";
    }

    if (diff < hour) {
        return Math.floor(diff / minute) + " minutes ago";
    }

    if (diff < hour * 2) {
        return "About 1 hour ago";
    }

    if (diff < day) {
        return  Math.floor(diff / hour) + " hours ago";
    }

    if (diff > day && diff < day * 2) {
        return "Yesterday";
    }

    if (diff < day * 365) {
        return Math.floor(diff / day) + " days ago";
    }

    else {
        return "Over a year ago";
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

