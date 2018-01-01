import React from 'react';
import {PageHeader} from 'react-bootstrap';

import EmergencyMapContainer from '../EmergencyMap/EmergencyMapContainer';
import FilterContainer from '../Filter/FilterContainer';
import './app.css'

class App extends React.Component {
  componentWillMount() {
    this.props.fetchEmergencies();
  }
  componentDidMount() {
    setInterval(this.props.fetchEmergencies, 2000);
  }
  render() {
    return(
      <div className='main-content'>
        <PageHeader bsClass="main-header">Isla Vista Emergencies <small>Real time updates</small></PageHeader>
        <div className='app-ui-container' >
          <EmergencyMapContainer />
          <FilterContainer />
        </div>
      </div>
    )
  }
}

export default App;
