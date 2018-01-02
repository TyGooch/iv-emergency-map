import React, { Component } from 'react'
import { Badge } from 'react-bootstrap';
import style from './style.js'

class EmergencyListItem extends Component {

  handleItemClick() {
    if(this.props.isNew){
      this.props.removeFromNewEmergencies(this.props.id);
    }
    window.google.maps.event.trigger(this.props.marker, 'click');
  }

  getIconUrl(description) {
    if(description.includes("Medical")) {
      return "https://image.ibb.co/eSAspm/medical_Icon5.png";
    } else if(description.includes("Fire")) {
      return "https://image.ibb.co/mgbF9m/fire_Icon2.png";
    } else if(description.includes("Vehicle Acc")) {
      return "https://image.ibb.co/dbg1FR/accident_Icon2.png";
    } else {
      return "https://image.ibb.co/cdGbFR/alert_Icon.png";
    }
  }


  render(){
    var time = new Date(this.props.time).toString();
    time = time.slice(0, -15);
    let className;
    if(this.props.isSelected){
      className = 'emergency-list-item-selected'
    } else if(this.props.isNew){
      className = 'emergency-list-item-new'
    } else {
      className = 'emergency-list-item'
    }

    return(
      <div
        className={ className }
        onClick={ this.handleItemClick.bind(this) }
      >
        <span>
        { this.props.description }
        { this.props.isNew ? (<div className='emergency-list-item-badge'><Badge >New</Badge></div>) : null}
        </span>
        <div className='emergency-list-item-info'>
          <div className='emergency-list-item-image-container'>
            <img className='emergency-list-item-image' src={this.getIconUrl(this.props.description)} />
          </div>
          <p>
            { time.slice(0,-14) }
            <br />
            { time.slice(-9) }
            <br />
            { this.props.address }
          </p>
        </div>
      </div>
    )
  }
}

export default EmergencyListItem;
