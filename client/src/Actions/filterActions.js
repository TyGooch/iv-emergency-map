import { fetchEmergencies } from './emergencyActions'

export const UPDATE_FILTER = 'UPDATE_FILTER';

export const changeFilter = (filter, value) => ({
  type: UPDATE_FILTER,
  filter,
  value
});

export const updateFilter = (filter, value) => (dispatch, getState) => {
  dispatch(changeFilter(filter, value));
  return fetchEmergencies(getState().filter)(dispatch);
};

// export const filterEmergencies = (filter, value) => (dispatch, getState) => {
//   dispatch(changeFilter(filter, value));
//   return fetchEmergencies(getState().filter)(dispatch);
// };
