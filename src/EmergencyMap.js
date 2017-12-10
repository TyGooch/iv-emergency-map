import React from 'react';
import ReactDOM from 'react-dom';
// import { withRouter } from 'react-router-dom';

import MarkerManager from './marker_manager';

const getCoordsObj = latLng => ({
  lat: latLng.lat(),
  lng: latLng.lng()
});

const mapOptions = {
  center: { lat: 34.4110, lng: -119.8610 },
  zoom: 15,
  disableDefaultUI: true,
  zoomControl: true
};

export default class EmergencyMap extends React.Component {
  componentDidMount() {
    const map = this.refs.map;
    this.map = new google.maps.Map(map, mapOptions);
    this.MarkerManager = new MarkerManager(this.map, this.handleMarkerClick.bind(this));
    if (this.props.singleEmergency) {
      this.props.fetchEmergency(this.props.benchId);
    } else {
      this.registerListeners();
      this.MarkerManager.updateMarkers(this.props.emergencies);
    }
  }

  componentDidUpdate() {
    if (this.props.singleEmergency) {
      const targetEmergencyKey = Object.keys(this.props.emergencies)[0];
      const targetEmergency = this.props.emergencies[targetEmergencyKey];
      this.MarkerManager.updateMarkers([targetEmergency]); //grabs only that one bench
    } else {
      this.MarkerManager.updateMarkers(this.props.emergencies);
    }
  }

  registerListeners() {
    google.maps.event.addListener(this.map, 'idle', () => {
      const { north, south, east, west } = this.map.getBounds().toJSON();
      const bounds = {
        northEast: { lat:north, lng: east },
        southWest: { lat: south, lng: west } };
      this.props.updateFilter('bounds', bounds);
    });
    google.maps.event.addListener(this.map, 'click', (event) => {
      const coords = getCoordsObj(event.latLng);
      this.handleClick(coords);
    });
  }

  handleMarkerClick(bench) {
    this.props.history.push(`emergencies/${bench.id}`);
  }

  handleClick(coords) {
    this.props.history.push({
      pathname: 'emergencies/new',
      search: `lat=${coords.lat}&lng=${coords.lng}`
    });
  }

  render() {
    return (
      <div className="map" ref="map">
        Map
      </div>
    );
  }
}

// export default withRouter(EmergencyMap);
