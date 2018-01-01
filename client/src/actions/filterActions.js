export const UPDATE_FILTER = 'UPDATE_FILTER';
export const TOGGLE_LIVE_UPDATES = 'TOGGLE_LIVE_UPDATES';

export const changeFilter = (filter, value) => ({
  type: UPDATE_FILTER,
  filter,
  value
});

export const updateFilter = (filter, value) => (dispatch, getState) => {
  dispatch(changeFilter(filter, value));
};

export const toggle = () => ({
  type: TOGGLE_LIVE_UPDATES
});

export const toggleLiveUpdates = () => (dispatch, getState) => {
  dispatch(toggle());
};
