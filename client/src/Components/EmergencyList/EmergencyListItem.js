import React, { Component } from 'react';
import style from './style.js'

class EmergencyListItem extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   author: '',
    //   text: ''
    // };
    //binding all our functions to this class
    this.clickMarker = this.clickMarker.bind(this);
  }
  
  clickMarker(marker) {
    // e.preventDefault();
    // debugger;
    window.google.maps.event.trigger(marker, 'click');
    // document.getElementById('gift-close').click()
  
  }
  
  render(){
    return(
      <div className="EmergencyListItem" style={ style.EmergencyListItem } onClick={ () => this.clickMarker(this.props.marker) }>
        <h3>{ this.props.description }</h3>
        <p>
          { this.props.time }
          <br />
          { this.props.address }
        </p>
      </div>
    )
  }
}

export default EmergencyListItem;
