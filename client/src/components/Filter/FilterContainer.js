import { connect } from 'react-redux';

import { updateFilter, toggleLiveUpdates } from '../../actions/filterActions';
import FilterForm from './FilterForm';

const mapStateToProps = state => ({
  liveUpdate: state.filters.liveUpdate,
  timeBounds: state.filters.timeBounds,
  limit: state.filters.limit,
  types: state.filters.types
});

const mapDispatchToProps = dispatch => ({
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value)),
  toggleLiveUpdates: () => dispatch(toggleLiveUpdates())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterForm);
