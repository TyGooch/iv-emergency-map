import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from 'react-bootstrap';
import EmergencyListItem from './EmergencyListItem';
import style from './style.js'
import './emergencyList.css'

class EmergencyList extends Component {
    constructor(props) {
      super(props);
      this.state={
        selectedEmergencyId: null,
        newEmergencyIds: []
      }
    }

    componentWillReceiveProps(nextProps){
      if( this.props.liveUpdate && this.props.allEmergencies.length > 0 &&  nextProps.allEmergencies.length > 0 && this.props.allEmergencies.length < nextProps.allEmergencies.length){
        let newState = this.state;
        let prevEmergencies = this.props.allEmergencies;
        nextProps.emergencies.forEach(emergency => {
          if(prevEmergencies.filter(item => item._id === emergency._id).length === 0){
            newState.newEmergencyIds = newState.newEmergencyIds.concat(emergency._id)
          }
        })
        this.setState(newState);
      }
    }

    componentWillUpdate(nextProps, nextState){
      if(this.props.map === null && nextProps.map !== null){
        nextProps.map.addListener('click', this.deselectEmergency.bind(this))
      }
    }


    componentDidUpdate(prevProps, prevState) {
      if(prevProps !== this.props){
        this.props.markers.forEach(marker => {
          marker.addListener('click', () => this.selectEmergency(marker.id))
        })
      }
      if(this.refs[this.state.selectedEmergencyId] !== undefined && this.props.markers.length > 0){
        this.refs[this.state.selectedEmergencyId].scrollIntoView({block: 'center', behavior: 'smooth'});
      }
    }

    selectEmergency(emergencyId){
      this.setState({selectedEmergencyId: emergencyId})
    }

    deselectEmergency(){
      this.setState({selectedEmergencyId: null})
    }

    removeFromNewEmergencies(emergencyId){
      let newState = this.state;
      newState.newEmergencyIds = newState.newEmergencyIds.filter(id => id !== emergencyId);
      this.setState(newState);
    }

    isNewEmergency(emergencyId){
      this.state.newEmergencyIds.forEach(id => {
        if(id === emergencyId){
          return true;
        }
      })
      return false;
    }

    render() {
      let markers = this.props.markers;
      let newEmergencyIds = this.state.newEmergencyIds;
      let selectEmergency = this.selectEmergency.bind(this);
      let isNewEmergency = this.isNewEmergency.bind(this);
      let removeFromNewEmergencies = this.removeFromNewEmergencies.bind(this);
      // debugger;
      console.log(this.state.newEmergencyIds);

      let newEmergencyBadge = null;
      if(newEmergencyIds.length > 0){
        newEmergencyBadge = (
          <div className='emergency-list-header-badge'>
            <Badge >{newEmergencyIds.length} New</Badge>
          </div>
        )
      }

      let emergencyListItems = this.props.emergencies.map((emergency, idx, emergencies) => {
        return(
          <div key={emergency._id} ref={emergency._id} >
            <EmergencyListItem
              id={ emergency._id }
              marker={ markers.filter(marker => marker.id === emergency._id)[0] }
              description={ emergency.description }
              address={ emergency.address }
              time={ emergency.time }
              selectEmergency={ this.selectEmergency.bind(this) }
              isSelected={ this.state.selectedEmergencyId === emergency._id }
              isNew={ this.state.newEmergencyIds.includes(emergency._id) }
              removeFromNewEmergencies={ this.removeFromNewEmergencies.bind(this) }>
            </EmergencyListItem>
          </div>
        )
      })

      return(
        <div className='emergency-list-container'>
          <div className='emergency-list-header'>
            <div className='emergency-list-header-text'>
              Latest { this.props.emergencies.length } Emergencies
            </div>
            {newEmergencyBadge}
          </div>
          <div className='emergency-list'>
            { emergencyListItems }
          </div>
        </div>
      )
    }
}

export default EmergencyList;
