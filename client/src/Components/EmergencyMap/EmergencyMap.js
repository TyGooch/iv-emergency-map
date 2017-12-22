import React from 'react';
import ReactDOM from 'react-dom';
// import { withRouter } from 'react-router-dom';

import MarkerManager from '../../Util/markerManager';
import style from './style.js'


const google = window.google;


// const getCoordsObj = latLng => ({
//   lat: latLng.lat(),
//   lng: latLng.lng()
// });

const mapOptions = {
  center: {
    lat: 34.4110,
    lng: -119.8610
  },
  zoom: 15,
  disableDefaultUI: true,
  zoomControl: true
};

class EmergencyMap extends React.Component {
  componentDidMount() {
    const map = this.refs.map;
    this.map = new google.maps.Map(map, mapOptions);
    this.MarkerManager = new MarkerManager(this.map, this.handleMarkerClick.bind(this));
    // if (this.props.singleEmergency) {
    //   this.props.fetchEmergency(this.props.benchId);
    // } else {
      // this.registerListeners();
      // this.MarkerManager.updateMarkers(this.props.emergencies);
      // setInterval(this.props.fetchEmergencies, 2000);
    // }
  }

  componentDidUpdate() {
    // if (this.props.singleEmergency) {
    //   const targetEmergencyKey = Object.keys(this.props.emergencies)[0];
    //   const targetEmergency = this.props.emergencies[targetEmergencyKey];
    //   this.MarkerManager.updateMarkers([targetEmergency]); //grabs only that one bench
    // } else {
      // this.filterEmergencies();
      // console.log(this.props.emergencies);
      this.MarkerManager.updateMarkers(this.props.emergencies);
    // }
  }

  filterEmergencies() {
    var filter = this.props.filter;
    var allowedTypes = [];
    Object.keys(filter.types).forEach(type => {
      if(filter.types[type]){
        allowedTypes.push(type);
      }
    })
    console.log(this.props.emergencies);


    // remove unnecessary types first
    var newEmergencies = this.props.emergencies.filter(emergency => {
      allowedTypes.forEach(type => { emergency.description.includes(type) })
    })

    return newEmergencies
  }

  registerListeners() {
    // google.maps.event.addListener(this.map, 'idle', () => {
    //   this.props.updateFilter();
    // });
    // google.maps.event.addListener(this.map, 'click', (event) => {
    //   const coords = getCoordsObj(event.latLng);
    //   this.handleClick(coords);
    // });
  }

  handleMarkerClick(bench) {
    alert("clicked!")
    // this.props.history.push(`emergencies/${bench.id}`);
  }

  // handleClick(coords) {
  //   this.props.history.push({
  //     pathname: 'emergencies/new',
  //     search: `lat=${coords.lat}&lng=${coords.lng}`
  //   });
  // }

  render() {
    return (
      <div className="map" ref="map">
        Map
      </div>
    );
  }
}

// export default withRouter(EmergencyMap);
export default EmergencyMap;
