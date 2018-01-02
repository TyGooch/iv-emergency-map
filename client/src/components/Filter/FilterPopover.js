import React, {Component} from 'react';
import { Popover } from 'react-bootstrap';

export default class FilterPopover extends Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          position: 'absolute',
          minWidth:'18.8vw',
          backgroundColor: 'rgb(81,159,250)',
          border: '1px solid #CCC',
          borderBottom:'none',
          borderRadius: 0,
          padding: 10,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
