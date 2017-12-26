import { connect } from 'react-redux';

import { fetchEmergencies } from '../../actions/emergencyActions';
// import { asArray } from '../../reducers/selectors';
import App from './App';

// const mapStateToProps = state => ({
//   emergencies: state.emergencies
// });

const mapDispatchToProps = dispatch => ({
  fetchEmergencies: () => dispatch(fetchEmergencies())
});

export default connect(
  null,
  mapDispatchToProps
)(App);