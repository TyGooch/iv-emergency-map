import merge from 'lodash/merge';

import { TOGGLE_LIVE_UPDATES } from '../Actions/liveUpdatesActions';

// const INITIAL_STATE = {
//   liveUpdates: true
// };

const liveUpdateReducer = (state = true, action) => {
  Object.freeze(state);
  if (action.type === TOGGLE_LIVE_UPDATES) {
    const newLiveUpdateStatus = {
      liveUpdates: !state.liveUpdates
    };
    return merge({}, state, newLiveUpdateStatus);
  } else {
    return state;
  }
};

export default liveUpdateReducer;
