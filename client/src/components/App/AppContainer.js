import { connect } from 'react-redux';

import { fetchEmergencies } from '../../actions/emergencyActions';
import App from './App';

const mapDispatchToProps = dispatch => ({
  fetchEmergencies: () => dispatch(fetchEmergencies())
});

export default connect(
  null,
  mapDispatchToProps
)(App);
