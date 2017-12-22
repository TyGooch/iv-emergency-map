import * as APIUtil from '../Util/emergencyAPIUtil'

export const RECEIVE_EMERGENCIES = 'RECEIVE_EMERGENCIES';

export const receiveEmergencies = emergencies => ({
  type: RECEIVE_EMERGENCIES,
  emergencies
});

export const fetchEmergencies = filters => dispatch => (
  APIUtil.fetchEmergencies(filters).then(emergencies => (
    dispatch(receiveEmergencies(emergencies))
  ))
);
// export const fetchEmergencies = filter => dispatch => (
//   APIUtil.fetchEmergencies(filter).then(emergencies => (
//     dispatch(receiveEmergencies(emergencies))
//   ))
// );
