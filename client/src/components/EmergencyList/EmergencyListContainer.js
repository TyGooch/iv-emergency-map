import { connect } from 'react-redux';

import EmergencyList from './EmergencyList';

const mapStateToProps = state => ({
  // allEmergencies: Object.keys(state.emergencies).map(key => state.emergencies[key]),
  allEmergencies: state.emergencies,
  liveUpdate: state.filters.liveUpdate
});

export default connect(
  mapStateToProps
)(EmergencyList);
