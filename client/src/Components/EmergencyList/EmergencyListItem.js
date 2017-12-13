import React, { Component } from 'react';

class EmergencyListItem extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   author: '',
    //   text: ''
    // };
    //binding all our functions to this class
    // this.handleClick = this.handleClick.bind(this);
  }
  
  // handleClick(marker) {
  //   // e.preventDefault();
  //   window.google.maps.event.trigger(marker, 'click');
  //   // document.getElementById('gift-close').click()
  // 
  // }
  
  render(){
    return(
      <div>
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
