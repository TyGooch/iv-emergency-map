import merge from 'lodash/merge';

import { UPDATE_FILTER } from '../Actions/filterActions';

const defaultFilter = Object.freeze({
  types: {Medical:false, Fire:true, Vehicle:false, other:true},
  minDate: new Date(new Date().setDate(new Date().getDate()-7)),
  maxDate: new Date(new Date(new Date().setDate(new Date().getDate()+1))),
  emergencyLimit: 10,
});

const filterReducer = (state = defaultFilter, action) => {
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

export default filterReducer;
