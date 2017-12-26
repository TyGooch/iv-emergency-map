import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import style from './style.js'
import 'react-datepicker/dist/react-datepicker.css';


const handleChange = (filter, updateFilter) => e => (
  updateFilter(filter, parseInt(e.currentTarget.value))
);

const handleTypeToggle = (filter, updateFilter) => e => {
  var types = filter.types;
  types[filter.type] = !types[filter.type];

  return updateFilter(filter.types, types)
}

class FilterForm extends React.Component {

  handleStartDateChange = date => {
    var timeBounds = this.props.timeBounds;
    timeBounds['earliest'] = date;
    this.props.updateFilter(this.props.timeBounds, timeBounds)
  }
  handleEndDateChange = date => {
    var timeBounds = this.props.timeBounds;
    timeBounds['latest'] = date;
    this.props.updateFilter(this.props.timeBounds, timeBounds)
  }

  render() {
    var types = this.props.types;
    var updateFilter = this.props.updateFilter;

    const typeFilters = Object.keys(types).map(type => (
      <div onClick={handleTypeToggle({types, type}, updateFilter)} style={style.TypeFilter}>
        <input type="checkbox"
        className="toggle"
        defaultChecked={types[type]}
        checked={types[type]}
        onChange={ handleTypeToggle({types, type}, updateFilter)}/>
        <label ref="text">{type}</label>
      </div>
    ))

    return(
      <div style={style.FilterBarContainer}>
        <span className="filter">Filter results: </span>
        { typeFilters }
        <div style={style.LimitFilter}>
          <label>Show at most </label>
          <input
            type="number"
            value={this.props.limit}
            onChange={handleChange('limit', this.props.updateFilter)}
          />
          <label> Emergencies </label>
        </div>
        <label>Between </label>
        <DatePicker
          selected={moment(this.props.timeBounds.earliest)}
          selectsStart
          startDate={moment(this.props.timeBounds.earliest)}
          endDate={moment(this.props.timeBounds.latest)}
          onChange={this.handleStartDateChange}
        />

        <DatePicker
          selected={moment(this.props.timeBounds.latest)}
          selectsEnd
          startDate={moment(this.props.timeBounds.earliest)}
          endDate={moment(this.props.timeBounds.latest)}
          onChange={this.handleEndDateChange}
        />
      </div>
    )
  }
}

export default FilterForm;
