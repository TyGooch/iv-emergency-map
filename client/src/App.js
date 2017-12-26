import React, { Component } from 'react';
// import EmergencyMap from './EmergencyMap'
import Map from './components/Map/Map'
import MapContainer from './components/Map/MapContainer'
import EmergencyList from './components/EmergencyList/EmergencyList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Isla Vista Emergencies</h1>
        </header>
        <MapContainer />
      </div>
    );
  }
}

export default App;
