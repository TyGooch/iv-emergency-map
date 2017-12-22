import merge from 'lodash/merge';

import {
  RECEIVE_EMERGENCIES
  // RECEIVE_EMERGENCY
} from '../Actions/emergencyActions';

const emergenciesReducer = (state = [], action) => {
  Object.freeze(state)
  let newState = merge({}, state);

  // switch(action.type) {
  //   case RECEIVE_EMERGENCIES:
  //     return action.emergencies;
  //
  //     // case RECEIVE_EMERGENCY:
  //     //   const newEmergency = {[action.emergency.id]: action.emergency};
  //     //   return merge({}, state, newEmergency);
  //   default:
  //     return state;
  // }
  switch(action.type) {
    case RECEIVE_EMERGENCIES:
      // if(state[0]){
        // debugger;
        // if (state[0]._id !== action.emergencies[0]._id){
        //   debugger;
          return action.emergencies;
        // } else {
        //   return state;
        // }
      // // }
      // else{
      //   return action.emergencies;
      // }
    default:
      return state;
  }
};

export default emergenciesReducer;
