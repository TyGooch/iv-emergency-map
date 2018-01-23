import React from 'react';
import ReactDOM from 'react-dom';
import MarkerClusterer from 'node-js-marker-clusterer';
// import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';

import {mapStyle} from './mapStyle.js';
import FilterContainer from '../Filter/FilterContainer';
import EmergencyList from '../EmergencyList/EmergencyList';
import style from './style.js';
import './emergencyMap.css';

const google = window.google;
const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'


export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.createMarker = this.createMarker.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.getIconUrl = this.getIconUrl.bind(this);
    this.markers = [];
    this.map = null;
    this.markerClusterer = null;
    this.oms = null;
    this.infowindow = null;
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
      if(this.infowindow.map === null){
        this.oms.unspiderfy();
      }
      infowindow.close();
    }.bind(this))

    const omsOptions = { legWeight: 1.5,
                        nearbyDistance: 0.001,
                        // markersWontMove: true,
                        // markersWontHide: true,
                        nudgeRadius: 80,
                        keepSpiderfied:true,
                        circleFootSeparation: 30,
                        spiralFootSeparation: 30,
                        spiralLengthStart: 30,
                        // spiralLengthFactor: 4,
                        // circleSpiralSwitchover: Infinity,
                        markerCountInBaseNudgeLevel: 2,
                        maxNudgeCount: false,
                        ignoreMapClick:true
}; // Just an example of omsOptions - please set your own if necessary
    this.oms = new OverlappingMarkerSpiderfier(this.map, omsOptions);
    var infowindow = this.infowindow;
    var oms = this.oms;
    this.oms.addListener('format', function (marker, status) {
      // console.log(marker);
      var clusterCount = oms.markersNearMarker(marker, false).length;
      clusterCount > 0 ? clusterCount += 1 : null;
      // console.log(clusterCount);
      var spiderIcon = {
        // url: 'https://image.ibb.co/mK0LE6/spider_Icon.png',
        // url: 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m3.png',
        // url: 'https://preview.ibb.co/kpf97R/spider_Icon2.png',
        // url: 'https://preview.ibb.co/hVpi1m/spider_Icon3.png',
        // url: 'https://image.ibb.co/dzGWCR/spider_Icon6.png',
        url: 'https://image.ibb.co/e2baRw/spider_Icon7.png',
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(20, 30),
        labelOrigin: new google.maps.Point(20,20)
      };
      // var spiderfiableIconUrl = `https://image.ibb.co/mK0LE6/spider_Icon.png`
      //   var icon = status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE
      //       ? spiderIcon :
      //       marker.initialIcon;

        if(status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE){
          marker.label = {text: clusterCount, color: 'white', labelAnchor: new google.maps.Point(0,0)
};
          marker.setIcon(spiderIcon);
        } else{
          marker.label = null;
          marker.setIcon(marker.initialIcon)
        }
    });
    this.oms.addListener('unspiderfy', function (unspiderfied, spiderfied) {
      console.log(unspiderfied);
      // unspiderfied.forEach(marker => marker.spiderfy());
    });



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
    // this.setState({filteredEmergencyCount:filteredEmergencies.length})
    // if(filteredEmergencies.length > filters.limit){
    //   filteredEmergencies = filteredEmergencies.slice(filteredEmergencies.length - filters.limit);
    // }

    return filteredEmergencies;
  }

  createMarkers(emergencies) {
    // if(this.oms){
    //   this.oms.clearMarkers();
    // }
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
      anchor: new google.maps.Point(15, 15)
    };
    const marker = new google.maps.Marker({
      id: emergency._id,
      position: pos,
      map: this.map,
      icon: icon,
      label: {
        text: '',
        color: 'white',
      },
      labelOrigin: new google.maps.Point(0,0),
      // labelAnchor: new google.maps.Point(0,0),
      // labelClass : "labels",
      // labelInBackground: false,
      initialIcon: icon
    });

    // if (this.oms) {
    //   this.oms.clearMarkers();
    // }

    var infowindow = this.infowindow;
    if(emergency.description.includes("Vehicle Acc")) {
      emergency.description = "Vehicle Accident";
    }

    marker.addListener('click', function() {
      // var time = new Date(emergency.time).toString();
      // time = time.slice(0, -15);
      //
      // var contentString = '<div><h3>' + emergency.description + '</h3><p>' + time.slice(0,-9) + '<br>' + time.slice(-9) + '<br>' + emergency.address + '</p></div>'
      // infowindow.setContent(contentString);
      // infowindow.open(this.map, this);
      infowindow.close(this.map, this);
    });

    this.markers.push(marker);

    // if(this.markers.length < this.props.filters.limit){
    //   this.markers.push(marker);
    // } else {
    //   this.markers.slice(0, this.props.filters.limit).forEach(marker => marker.setMap(null));
    //   this.markers = this.markers.slice(0, this.props.filters.limit - 2);
    //   this.markers = this.markers.concat([marker]);
    // }
    // this.markerCluster.addMarker(marker);
    // marker.addListener('click', ()=>{infoWindow.close()});
    this.oms.addMarker(marker, function(e) {
      // iw.setContent(markerData.text);
      // iw.open(map, marker);
      var time = new Date(emergency.time).toString();
      time = time.slice(0, -15);

      var contentString = '<div><h3>' + emergency.description + '</h3><p>' + time.slice(0,-9) + '<br>' + time.slice(-9) + '<br>' + emergency.address + '</p></div>'
      infowindow.setContent(contentString);
      infowindow.open(this.map, this);
    });
    // this.oms.addMarker(marker);

    // var mc = new MarkerClusterer(this.map, this.markers);
    // this.markerClusterer = new MarkerClusterer(this.map, this.markers, {
    //   maxZoom: 15,
    //   imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    // });
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
    // return "https://preview.ibb.co/cfTAgm/emergency_Icon_Drop.png"
    // return "https://preview.ibb.co/nOACu6/emergency_Icon_Drop2.png"
  }

  getMarkers(){
    if(this.oms){
      return this.oms.getMarkers()
    } else{
      return [];
    }
  }

  render() {
    this.clearMarkers();
    // this.createMarkers(this.filterEmergencies().slice(this.filterEmergencies().length - this.props.filters.limit));;
    this.createMarkers(this.filterEmergencies().slice(0, this.props.filters.limit));;

    return (
      <div>
        <div className='app-ui-container' >
          <div className={this.state.showingUpdateBanner ? 'live-update-banner-shown' : 'live-update-banner-hidden'}
               style={this.props.filters.liveUpdate ? {backgroundColor:'rgb(91,184,92)'} : {backgroundColor:'rgb(240,174,78)'}}
          >
          Live Updates {this.props.filters.liveUpdate ? 'Enabled' : 'Disabled'}
          </div>
          <div className='ui-wrapper'>
            <div className='map-container' >
              <div id='map' ref='map'/>
              <FilterContainer filteredEmergencyCount={this.filterEmergencies().length}/>
            </div>
            <EmergencyList
              map={ this.map }
              allEmergencies={ this.props.emergencies }
              // emergencies={ this.filterEmergencies().slice(this.filterEmergencies().length - this.props.filters.limit).reverse() }
              emergencies={ this.filterEmergencies().slice(0, this.props.filters.limit).reverse() }
              markers={ this.getMarkers().reverse() }
              liveUpdate ={ this.props.filters.liveUpdate }
              infowindow={this.infowindow}
            />
          </div>
        </div>
      </div>
    );
  }
}
