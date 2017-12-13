import React, { Component } from 'react';
import EmergencyListItem from './EmergencyListItem';

class EmergencyList extends Component {
    render() {
      let emergencyListItems = this.props.emergencies.map(emergency => {
        return(
          <EmergencyListItem
            description={ emergency.description }
            address={ emergency.address }
            time={ emergency.time }>
          </EmergencyListItem>
        )
      })
      
      return(
        <div>
          <h2>Last { this.props.emergencies.length } Emergencies </h2>
          { emergencyListItems }
        </div>
      )
    }
}

export default EmergencyList;