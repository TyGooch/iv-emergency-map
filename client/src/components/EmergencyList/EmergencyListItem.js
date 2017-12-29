import React, { Component } from 'react';
import style from './style.js'

class EmergencyListItem extends Component {
  constructor(props) {
    super(props);
    this.clickMarker = this.clickMarker.bind(this);
  }

  componentDidMount(){
    this.props.marker.addListener('click', () => this.props.selectEmergency(this.props.id))
  }

  clickMarker(marker) {
    window.google.maps.event.trigger(marker, 'click');
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

    return(
      <div
        className={this.props.isSelected ? "emergency-list-item-selected" : "emergency-list-item"}
        onClick={ () => {
          this.clickMarker(this.props.marker);
          this.props.selectEmergency(this.props.id);
        }}
      >
        <span>{ this.props.description }</span>
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
