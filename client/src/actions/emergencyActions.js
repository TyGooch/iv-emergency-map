import * as APIUtil from '../util/emergencyAPIUtil'

export const RECEIVE_EMERGENCIES = 'RECEIVE_EMERGENCIES';

export const receiveEmergencies = emergencies => ({
  type: RECEIVE_EMERGENCIES,
  emergencies
});

export const fetchEmergencies = () => dispatch => (
  APIUtil.fetchEmergencies().then(emergencies => (
    dispatch(receiveEmergencies(emergencies))
  ))
);