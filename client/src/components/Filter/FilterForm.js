import React from 'react';
// import DatePicker from 'react-datepicker';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import DateRangeFilter from './DateRangeFilter';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';


import style from './style.js'


class FilterForm extends React.Component {

  handleLimitChange(event){
    this.props.updateFilter('limit', event.target.value)
  };

  handleDateChange(startDate, endDate) {

  }
  //
  // handleStartDateChange(date){
  //   var timeBounds = this.props.timeBounds;
  //   timeBounds['earliest'] = date;
  //   this.props.updateFilter(this.props.timeBounds, timeBounds)
  // }
  // handleEndDateChange(date){
  //   var timeBounds = this.props.timeBounds;
  //   timeBounds['latest'] = date;
  //   this.props.updateFilter(this.props.timeBounds, timeBounds)
  // }

  handleTypeClick(activeTypes){
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
        <ButtonToolbar>
              <ToggleButtonGroup type="checkbox" defaultValue={Object.keys(this.props.types)} onChange={this.handleTypeClick.bind(this)}>
                <ToggleButton data-key='Medical' value={'Medical'} >Medical</ToggleButton>
                <ToggleButton data-key='Fire' value={'Fire'}>Fire</ToggleButton>
                <ToggleButton data-key='Vehicle' value={'Vehicle'}>Vehicle</ToggleButton>
                <ToggleButton data-key='Other' value={'Other'}>Other</ToggleButton>
              </ToggleButtonGroup>
        </ButtonToolbar>
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
        Between

        <DateRangeFilter startDate={this.props.timeBounds.startDate} endDate={this.props.timeBounds.endDate} updateFilter={this.props.updateFilter}/>

      </div>
    )
  }
}

export default FilterForm;
