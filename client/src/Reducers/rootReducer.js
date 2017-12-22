import { combineReducers } from 'redux';

import emergencies from './emergenciesReducer';
import data from './dataReducer';
import filter from './filterReducer';
import liveUpdates from './liveUpdatesReducer';

const rootReducer = combineReducers({
  emergencies,
  filter,
  liveUpdates
});

export default rootReducer;
