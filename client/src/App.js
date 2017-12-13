import React, { Component } from 'react';
// import EmergencyMap from './EmergencyMap'
import Map from './Components/Map/Map'
import MapContainer from './Components/Map/MapContainer'
import EmergencyList from './Components/EmergencyList/EmergencyList'

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
