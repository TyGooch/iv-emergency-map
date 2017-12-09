import React, { Component } from 'react';
// import EmergencyMap from './EmergencyMap'
import Map from './Map'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Isla Vista Emergencies</h1>
        </header>
        <Map />
      </div>
    );
  }
}

export default App;
