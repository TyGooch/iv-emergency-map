import { connect } from 'react-redux';

import { updateFilter } from '../../actions/filterActions';
import { asArray } from '../../reducers/selectors';
import Search from './search';

const mapStateToProps = state => ({
  timeBounds: state.filters.timeBounds,
  limit: state.filters.limit,
  types: state.filters.types
});

const mapDispatchToProps = dispatch => ({
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);