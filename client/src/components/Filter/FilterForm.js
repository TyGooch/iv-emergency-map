import React from 'react';
// import DatePicker from 'react-datepicker';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import FilterCalendar from './FilterCalendar';
import {Tabs, Tab, ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';


import style from './style.js'


class FilterForm extends React.Component {

  constructor(props){
    super(props);
    this.state={
      readOnlyCalendar: true
    }
  }

  handleLimitChange(event){
    this.props.updateFilter('limit', event.target.value)
  };

  handleDateToggle(dayInterval) {
    if(dayInterval === 'custom'){
      var startDate = '';
      var endDate = '';
      this.setState({readOnlyCalendar: false});
    } else{
      startDate = new Date(Date.now() - (dayInterval*24*60*60*1000));
      endDate = new Date()
      this.setState({readOnlyCalendar: true});
    }
    this.props.updateFilter('timeBounds', {startDate: startDate, endDate: endDate})
  }


  handleTypeToggle(activeTypes){
    var newTypes = {}
    Object.keys(this.props.types).map(type =>
      {
        if(activeTypes.includes(type)){
          newTypes[type] = true;
        }
        else{
          newTypes[type] = false
        }
      });
    this.props.updateFilter('types', newTypes)
  }

  render() {
    return(
      <div style={style.FilterBarContainer}>
        <span className="filter">Filter results: </span>
        <Tabs id="filterNav">
          <Tab eventKey={1} title="Emergency Type">
            <ButtonToolbar>
                  <ToggleButtonGroup type="checkbox" defaultValue={Object.keys(this.props.types)} onChange={this.handleTypeToggle.bind(this)}>
                    <ToggleButton data-key='Medical' value={'Medical'} >Medical</ToggleButton>
                    <ToggleButton data-key='Fire' value={'Fire'}>Fire</ToggleButton>
                    <ToggleButton data-key='Vehicle' value={'Vehicle'}>Vehicle</ToggleButton>
                    <ToggleButton data-key='Other' value={'Other'}>Other</ToggleButton>
                  </ToggleButtonGroup>
            </ButtonToolbar>
          </Tab>
          <Tab eventKey={2} title="Count">
            <div style={style.LimitFilter}>
              Show at most
              <input
                type="number"
                min="1"
                pattern="[0-9]*"
                value={this.props.limit}
                onChange={this.handleLimitChange.bind(this)}
              />
              Emergencies
            </div>
          </Tab>
          <Tab eventKey={3} title="Date">
          <ButtonToolbar>
            <ToggleButtonGroup type="radio" name="timeOptions" defaultValue={'7'} onChange={this.handleDateToggle.bind(this)}>
              <ToggleButton value={'1'}>Yesterday</ToggleButton>
              <ToggleButton value={'7'}>1 Week Ago</ToggleButton>
              <ToggleButton value={'31'}>1 Month Ago</ToggleButton>
              <ToggleButton value={'custom'}>Custom Range</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>

          <FilterCalendar startDate={this.props.timeBounds.startDate} endDate={this.props.timeBounds.endDate} updateFilter={this.props.updateFilter} readOnly={this.state.readOnlyCalendar} />

          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default FilterForm;
