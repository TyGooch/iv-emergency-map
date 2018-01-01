import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

    componentDidMount() {
    }

    componentWillUpdate(nextProps, nextState){
      if(this.props.map === null && nextProps.map !== null){
        nextProps.map.addListener('click', this.deselectEmergency.bind(this))
      }

      // this.props.markers.forEach(marker => {
      //   marker.addListener('click', () => this.selectEmergency(marker.id))
      // })
      // console.log(this.props);
      // console.log(nextProps);
    }


    componentDidUpdate(prevProps, prevState) {
      // debugger;
      if(prevProps !== this.props){
        // debugger;
        console.log('update');
        this.props.markers.forEach(marker => {
          marker.addListener('click', () => this.selectEmergency(marker.id))
        })
      }
      if(this.refs[this.state.selectedEmergencyId] !== undefined && this.props.markers.length > 0){
        // console.log(this.state.selectedEmergencyId);
        this.refs[this.state.selectedEmergencyId].scrollIntoView({block: 'center', behavior: 'smooth'});
      }
      // this.props.emergencies.forEach(emergency =>{
      //   if(this.state.selectedEmergencyId === emergency._id){
      //     this.refs.selected.scrollIntoView({block: 'center', behavior: 'smooth'});
      //   }
      // })
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
      // console.log(markers);
      let selectEmergency = this.selectEmergency.bind(this);
      let emergencyListItems = this.props.emergencies.map((emergency, idx, emergencies) => {
        return(
          <div key={emergency._id} ref={emergency._id} >
            <EmergencyListItem
              id={emergency._id}
              marker={ markers.filter(marker => marker.id === emergency._id)[0] }
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
