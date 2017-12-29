import React, { Component } from 'react';
import EmergencyListItem from './EmergencyListItem';
import style from './style.js'
import './emergencyList.css'

class EmergencyList extends Component {
    constructor(props) {
      super(props);
      this.state={
        selectedEmergencyId: null
      }

    }

    selectEmergency(emergencyId){
      // debugger;
      this.setState({selectedEmergencyId: emergencyId})
    }

    render() {
      let markers = this.props.markers;
      let emergencyListItems = this.props.emergencies.map((emergency, idx, emergencies) => {
        return(
          <EmergencyListItem
            key={emergency._id}
            id={emergency._id}
            marker={ markers[idx] }
            description={ emergency.description }
            address={ emergency.address }
            time={ emergency.time }
            selectEmergency={this.selectEmergency.bind(this)}
            isSelected={this.state.selectedEmergencyId === emergency._id}>
          </EmergencyListItem>
        )
      })

      return(
        <div className='emergency-list-container'>
          <div className='emergency-list-header'>Latest { this.props.emergencies.length } Emergencies</div>
          <div className='emergency-list'>
            { emergencyListItems }
          </div>
        </div>
      )
    }
}

export default EmergencyList;
