import merge from 'lodash/merge';

import {
  RECEIVE_EMERGENCIES
} from '../actions/emergencyActions';

const emergenciesReducer = (state = [], action) => {
  Object.freeze(state)
  let newState = merge([], state);

  switch(action.type) {
    case RECEIVE_EMERGENCIES:
      if(!state[0]){
        return action.emergencies;
      } else if(state[state.length -1]._id !== action.emergencies[action.emergencies.length - 1]._id){
        var newEmergencies = [];
        for(var i = state.length; i < action.emergencies.length; i++){
          newEmergencies.push(action.emergencies[i])
        }
        return newState.concat(newEmergencies);
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default emergenciesReducer;