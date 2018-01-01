import { connect } from 'react-redux';

import EmergencyList from './EmergencyList';

const mapStateToProps = state => ({
  emergencies: Object.keys(state.emergencies).map(key => state.emergencies[key]),
  liveUpdate: state.filters.liveUpdate
});

export default connect(
  mapStateToProps
)(EmergencyList);
