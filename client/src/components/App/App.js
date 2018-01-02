import React from 'react';
import {PageHeader} from 'react-bootstrap';

import EmergencyMapContainer from '../EmergencyMap/EmergencyMapContainer';
import FilterContainer from '../Filter/FilterContainer';
import './app.css'

class App extends React.Component {
  getLiveUpdate(){
    if(this.props.liveUpdate){
      this.props.fetchEmergencies();
    }
  }
  componentWillMount() {
    this.props.fetchEmergencies();
  }
  componentDidMount() {
    setInterval(this.getLiveUpdate.bind(this), 2000);
  }
  render() {
    return(
      <div className='main-content'>
        <PageHeader bsClass="main-header">Isla Vista Emergencies <small>Real time updates</small></PageHeader>
        <div >
          <EmergencyMapContainer />
        </div>
      </div>
    )
  }
}

export default App;
