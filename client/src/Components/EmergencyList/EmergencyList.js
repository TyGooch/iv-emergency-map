import React, { Component } from 'react';
import EmergencyListItem from './EmergencyListItem';
import style from './style.js'

class EmergencyList extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let emergencyListItems = this.props.emergencies.map((emergency, idx, emergencies) => {
        return(
          <EmergencyListItem
            marker={ this.props.markers[idx] }
            description={ emergency.description }
            address={ emergency.address }
            time={ emergency.time }>
          </EmergencyListItem>
        )
      })
      
      return(
        <div className="EmergencyList" style={ style.EmergencyList }>
          <h2>Last { this.props.emergencies.length } Emergencies </h2>
          { emergencyListItems }
        </div>
      )
    }
}

export default EmergencyList;