import { connect } from 'react-redux';

// import { updateFilter } from '../../actions/filter_actions';
// import { asArray } from '../../reducers/selectors';
import EmergencyMap from './EmergencyMap';

const mapStateToProps = state => ({
  // emergencies: state.emergencies
  emergencies: Object.keys(state.emergencies).map(key => state.emergencies[key])
});

// const mapDispatchToProps = dispatch => ({
//   updateFilter: (filter, value) => dispatch(updateFilter(filter, value))
// });

export default connect(
  mapStateToProps
)(EmergencyMap);