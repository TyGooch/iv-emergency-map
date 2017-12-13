import React from 'react';
import ReactDOM from 'react-dom';
import {mapStyle} from './mapStyle.js';
import EmergencyList from '../EmergencyList/EmergencyList';
import style from './style.js'

const google = window.google;

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //     markers: []
    // }
    // this.loadEmergenciesFromServer = this.loadEmergenciesFromServer.bind(this);
    // this.initializeState = this.initializeState.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.getIconUrl = this.getIconUrl.bind(this);
    this.markers = [];
    // this.parseTime = this.parseTime.bind(this);
  }

  componentDidMount() {
    // this.axiosInstance = axios.create({
    //   baseURL: process.env.BASE_URL
    // });
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
    
    // this.markers = [];

    this.infowindow = new google.maps.InfoWindow({
      content: ''
    });

    // this.initializeState();

    // close infowindow on click out
    var infowindow = this.infowindow;
    this.map.addListener('click', function() {
      infowindow.close();
    })

    // setInterval(this.loadEmergenciesFromServer, 2000);
  }

  createMarkers(emergencies) {
    if(this.markers.length >= 10){
      this.markers.slice(-(emergencies.length)).forEach(marker => { marker.setMap(null)});
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

    if(this.markers.length <= 9){
      this.markers = this.markers.concat([marker]);
      // this.setState({markers: this.state.markers.concat([marker])});
    } else {
      this.markers = this.markers.slice(0,8).concat([marker]);
      // this.setState({markers: this.state.markers.slice(0,8).concat([marker])});
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

  render() {
    if(this.props.emergencies.length > 0){
      console.log(this.props.emergencies);
      this.createMarkers(this.props.emergencies);
    }
    return (
      <div style={ style.MapContainer }>
        <div id='map' ref='map' style={style.Map}/>
        <EmergencyList 
          emergencies={ this.props.emergencies } 
          markers={ this.markers } 
          />
      </div>
    );
  }
}

