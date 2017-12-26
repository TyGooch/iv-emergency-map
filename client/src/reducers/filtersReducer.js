import merge from 'lodash/merge';

import { UPDATE_FILTER } from '../actions/filterActions';

const defaultFilters = Object.freeze({
  // default to within last 24 hrs
  timeBounds: { earliest: new Date().setDate(new Date().getDate() - 1), latest: new Date().setDate(new Date().getDate() + 1) },
  limit: 2,
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