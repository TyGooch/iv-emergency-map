import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';
import EmergencyList from '../EmergencyList/EmergencyList';

export default class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        emergencies: []
    }
    this.fetchEmergencies = this.fetchEmergencies.bind(this);
    this.initializeState = this.initializeState.bind(this);
  }
  
  initializeState() {
    fetch('/api/emergencies/latest')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(emergencies => {
        this.setState({
          emergencies: emergencies
        });
      }).catch(e => {
        this.setState({
          emergencies: `API call failed: ${e}`,
        });
      })
   }
  
  componentDidMount(){
    this.initializeState();

    setInterval(this.fetchEmergencies, 2000);
  }
  
  fetchEmergencies() {
    fetch('/api/emergencies/latest')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(emergencies => {
        if( this.state.emergencies[0]._id !== emergencies[0]._id ){
          // var newEmergencies = emergencies.filter(emergency => this.state.emergencies.indexOf(emergency) < 0);
          // this.createMarkers(newEmergencies);
          this.setState({ emergencies: emergencies });
        }
      }).catch(e => {
        this.setState({
          emergencies: `API call failed: ${e}`,
        });
      })
  }
  
  render() {
    return(
      <div>
      <Map emergencies={ this.state.emergencies } />
      </div>
    )
  }
  
}