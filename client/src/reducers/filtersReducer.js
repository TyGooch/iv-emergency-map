import merge from 'lodash/merge';
import moment from 'moment';


import { UPDATE_FILTER } from '../actions/filterActions';

const defaultFilters = Object.freeze({
  // default to within last 24 hrs
  timeBounds: { earliest: moment().subtract(7, 'days'), latest: moment().add(5, 'hours') },
  limit: 10,
  types: { Medical: true, Vehicle: true, Fire: true, Other: true }
});

const filtersReducer = (state = defaultFilters, action) => {
  Object.freeze(state);
  if (action.type === UPDATE_FILTER) {
    const newFilter = {
      [action.filter]: action.value
    };
    return merge({}, state, newFilter);
  } else {
    return state;
  }
};

export default filtersReducer;
