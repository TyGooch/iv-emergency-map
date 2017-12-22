import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import MarkerManager from '../../Util/markerManager';

import { fetchEmergencies } from '../../Actions/emergencyActions';
import { updateFilter } from '../../Actions/filterActions';
import { asArray } from '../../Reducers/selectors';
import Search from './Search';

const mapStateToProps = state => ({
  emergencies: asArray(state.entities),
  filter: state.filter
});

const mapDispatchToProps = dispatch => ({
  fetchEmergencies: (filter) => dispatch(fetchEmergencies(filter)),
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
