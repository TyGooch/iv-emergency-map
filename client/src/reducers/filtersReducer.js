import merge from 'lodash/merge';
import moment from 'moment';


import { UPDATE_FILTER, TOGGLE_LIVE_UPDATES } from '../actions/filterActions';

const defaultFilters = Object.freeze({
  liveUpdate: true,
  // default to within last 24 hrs
  timeBounds: { startDate: new Date(Date.now() - (7*24*60*60*1000)), endDate: new Date(Date.now() + (1*60*60*1000)) },
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
  } else if (action.type === TOGGLE_LIVE_UPDATES) {
    return merge({}, state, {liveUpdate: !state.liveUpdate})
  } else {
    return state;
  }
};

export default filtersReducer;
