class MarkerManager {
  constructor(map, handleClick){
    this.map = map;
    this.handleClick = handleClick;
    this.markers = {};
  }

  updateMarkers(emergencies){
    const emergenciesObj = {};
    emergencies.forEach(emergency => emergenciesObj[emergency.id] = emergency);

    emergencies
      .filter(emergency => !this.markers[emergency.id])
      .forEach(newEmergency => this.createMarkerFromEmergency(newEmergency, this.handleClick))

    Object.keys(this.markers)
      .filter(emergencyId => !emergenciesObj[emergencyId])
      .forEach((emergencyId) => this.removeMarker(this.markers[emergencyId]))
  }

  createMarkerFromEmergency(emergency) {
    const position = new google.maps.LatLng(emergency.position.lat, emergency.position.lng);
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      emergencyId: emergency.id
    });

    marker.addListener('click', () => this.handleClick(emergency));
    this.markers[marker.emergencyId] = marker;
  }

  removeMarker(marker) {
    this.markers[marker.emergencyId].setMap(null);
    delete this.markers[marker.emergencyId];
  }
}

export default MarkerManager;
