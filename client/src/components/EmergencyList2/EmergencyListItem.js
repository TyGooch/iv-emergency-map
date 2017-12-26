import React, { Component } from 'react';
import style from './style.js'

class EmergencyListItem extends Component {
  constructor(props) {
    super(props);
    //binding all our functions to this class
    this.clickMarker = this.clickMarker.bind(this);
  }
  
  clickMarker(marker) {
    window.google.maps.event.trigger(marker, 'click');
  
  }
  
  render(){
    var time = new Date(this.props.time).toString();
    time = time.slice(0, -15);
    
    return(
      <div className="EmergencyListItem" style={ style.EmergencyListItem } onClick={ () => this.clickMarker(this.props.marker) }>
        <h3>{ this.props.description }</h3>
        <p>
          { time.slice(0,-14) }
          <br />
          { time.slice(-9) }
          <br />
          { this.props.address }
        </p>
      </div>
    )
  }
}

export default EmergencyListItem;
