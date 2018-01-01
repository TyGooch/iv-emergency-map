import { connect } from 'react-redux';

import { fetchEmergencies } from '../../actions/emergencyActions';
import App from './App';

const mapStateToProps = state => ({
  liveUpdate: state.filters.liveUpdate
});

const mapDispatchToProps = dispatch => ({
  fetchEmergencies: () => dispatch(fetchEmergencies())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
