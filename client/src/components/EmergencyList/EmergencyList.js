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

    componentDidUpdate() {
      // debugger;
      this.props.map.addListener('click', this.deselectEmergency.bind(this))
      if(this.state.selectedEmergencyId){
        this.refs.selected.scrollIntoView({block: 'center', behavior: 'smooth'});
      }
    }

    selectEmergency(emergencyId){
      // debugger;
      this.setState({selectedEmergencyId: emergencyId})
    }

    deselectEmergency(){
      this.setState({selectedEmergencyId: null})
    }

    render() {
      let markers = this.props.markers;
      let emergencyListItems = this.props.emergencies.map((emergency, idx, emergencies) => {
        return(
          <div ref={this.state.selectedEmergencyId === emergency._id ? "selected" : null} >
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
          </div>
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
