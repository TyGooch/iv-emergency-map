import { combineReducers } from 'redux';

import emergencies from './emergenciesReducer';
import filters from './filtersReducer';
// import ui from './ui_reducer';
// import session from './session_reducer';
// import errors from './errors_reducer';

const rootReducer = combineReducers({
  emergencies,
  filters
});

export default rootReducer;