import React from 'react';
import ReactDOM from 'react-dom';
import {mapStyle} from './mapStyle.js';
import FilterContainer from '../Filter/FilterContainer';
import EmergencyList from '../EmergencyList/EmergencyList';
import style from './style.js';
import './emergencyMap.css';

const google = window.google;

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.createMarker = this.createMarker.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.getIconUrl = this.getIconUrl.bind(this);
    this.markers = [];
    this.map = null;
    this.state={
      showingUpdateBanner:false
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.filters.liveUpdate !== this.props.filters.liveUpdate){
      this.setState({
        showingUpdateBanner: true
      });

      setTimeout(() => {
        this.setState({
          showingUpdateBanner: false
        });
      }, 5000);
    }
  }

  componentDidMount() {
    const map = ReactDOM.findDOMNode(this.refs.map)

    const options = {
      center: { lat: 34.4116, lng: -119.8610 },
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


    // close infowindow on click out
    var infowindow = this.infowindow;
    this.map.addListener('click', function() {
      infowindow.close();
    })

  }

  filterEmergencies() {
    var emergencies = this.props.emergencies;
    var filters = this.props.filters;
    var filteredEmergencies = [];

    var allowedTypes = [];
    Object.keys(filters.types).forEach( type => {filters.types[type] ? allowedTypes.push(type) : null});
    if(allowedTypes.length === 0){
      return filteredEmergencies;
    }
    var allowedTypesRegex = new RegExp(allowedTypes.join('|'));

    emergencies.forEach(emergency => {
      var match = emergency.description.match(allowedTypesRegex);
      var date = new Date(emergency.time).getTime();
      var withinTimeBounds = (filters.timeBounds.startDate <= date && date <= filters.timeBounds.endDate)

      if(match && withinTimeBounds){
        filteredEmergencies.push(emergency);
      } else if(allowedTypes.includes("Other") && withinTimeBounds)
      {
        var otherTypesRegex = new RegExp(Object.keys(filters.types).join('|'))
        if(!emergency.description.match(otherTypesRegex)){
          filteredEmergencies.push(emergency);
        }
      }
    })
    if(filteredEmergencies.length > filters.limit){
      filteredEmergencies = filteredEmergencies.slice(filteredEmergencies.length - filters.limit);
    }

    return filteredEmergencies;
  }

  createMarkers(emergencies) {
    emergencies.forEach(this.createMarker);
  }

  clearMarkers(){
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  createMarker(emergency) {
    const pos = new google.maps.LatLng(emergency.position.lat, emergency.position.lng);
    const iconUrl = this.getIconUrl(emergency);
    var icon = {
      url: iconUrl,
      scaledSize: new google.maps.Size(30, 30),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 0)
    };
    const marker = new google.maps.Marker({
      id: emergency._id,
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

    if(this.markers.length < this.props.filters.limit){
      this.markers.push(marker);
    } else {
      this.markers.slice(0, this.props.filters.limit).forEach(marker => marker.setMap(null));
      this.markers = this.markers.slice(0, this.props.filters.limit - 2).concat([marker]);
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
    this.clearMarkers();
    this.createMarkers(this.filterEmergencies());;

    return (
      <div>
        <div className='app-ui-container' >
          <div className={this.state.showingUpdateBanner ? 'live-update-banner-shown' : 'live-update-banner-hidden'}>
          Live Updates {this.props.filters.liveUpdate ? 'Enabled' : 'Disabled'}
          </div>
          <div className='ui-wrapper'>
            <div className='map-container' >
              <div id='map' ref='map'/>
              <FilterContainer />
            </div>
            <EmergencyList
              map={ this.map }
              emergencies={ this.filterEmergencies().reverse() }
              markers={ this.markers.reverse() }
            />
          </div>
        </div>
      </div>
    );
  }
}
