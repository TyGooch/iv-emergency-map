import React from 'react';

const handleChange = (filter, updateFilter) => e => (
  updateFilter(filter, parseInt(e.currentTarget.value))
);

const handleTypeToggle = (filter, updateFilter) => e => {
  // debugger;
  var types = filter.types;
  types[filter.type] = !types[filter.type];
  
  return updateFilter(filter.types, types)
}

class FilterForm extends React.Component {
  
  render() {
    var types = this.props.types;
    var updateFilter = this.props.updateFilter;
    
    const typeFilters = Object.keys(types).map(type => (
      <div>
      <input type="checkbox"
      className="toggle"
      defaultChecked={types[type]}
      onChange={ handleTypeToggle({types, type}, updateFilter)}/>
      <label ref="text">{type}</label>
      </div>
    ))
    
    return(
      <div>
        <span className="filter">Filter results:</span>
        <br/>
        { typeFilters }
        <br/>
        <label>Maximum Emergencies</label>
        <input
          type="number"
          value={this.props.limit}
          onChange={handleChange('limit', this.props.updateFilter)}
        />
      </div>
    )
  }
}

export default FilterForm;