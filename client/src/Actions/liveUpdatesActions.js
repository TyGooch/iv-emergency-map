export const TOGGLE_LIVE_UPDATES = 'TOGGLE_LIVE_UPDATES';

export const toggleLiveUpdates = () => ({
  type: TOGGLE_LIVE_UPDATES
});

// export const updateFilter = (filter, value) => (dispatch, getState) => {
//   dispatch(changeFilter(filter, value));
//   return fetchEmergencies(getState().filter)(dispatch);
// };
