import { combineReducers } from 'redux';

import emergencies from './emergenciesReducer';
import filters from './filtersReducer';

const rootReducer = combineReducers({
  emergencies,
  filters
});

export default rootReducer;
