import { connect } from 'react-redux';

import EmergencyMap from './EmergencyMap';

const mapStateToProps = state => ({
  emergencies: Object.keys(state.emergencies).map(key => state.emergencies[key]),
  filters: state.filters
});

export default connect(
  mapStateToProps
)(EmergencyMap);
