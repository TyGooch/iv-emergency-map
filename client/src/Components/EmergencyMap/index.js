import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import MarkerManager from '../../Util/markerManager';

import { fetchEmergencies } from '../../Actions/emergencyActions';
import EmergencyMap from './EmergencyMap';

const mapStateToProps = state => ({
  emergencies: asArray(state.entities),
  filter: state.filter
});

// const mapDispatchToProps = dispatch => ({
//   fetchEmergencies: (filter) => dispatch(fetchEmergencies(filter)),
//   updateFilter: (filter, value) => dispatch(updateFilter(filter, value))
// });

const EmergencyMap = ({ emergencies, filter }) => (


export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(EmergencyMap);
