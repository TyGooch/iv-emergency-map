import React from 'react';
import {PageHeader} from 'react-bootstrap';

import EmergencyMapContainer from '../EmergencyMap/EmergencyMapContainer';
import FilterContainer from '../Filter/FilterContainer';

class App extends React.Component {
  componentWillMount() {
    this.props.fetchEmergencies();
  }
  componentDidMount() {
    setInterval(this.props.fetchEmergencies, 2000);
  }
  render() {
    return(
      <div>
        <PageHeader>Isla Vista Emergencies <small>Real time updates</small></PageHeader>
        <EmergencyMapContainer />
        <FilterContainer />
      </div>
    )
  }
}

export default App;
