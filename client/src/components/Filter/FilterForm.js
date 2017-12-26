import React from 'react';

const handleChange = (filter, updateFilter) => e => (
  updateFilter(filter, parseInt(e.currentTarget.value))
);

const FilterForm = ({ limit, types, timeBounds, updateFilter}) => { 
  return(
  <div>
    <span className="filter">Filter results:</span>
    <br/>
    <label>Maximum Emergencies</label>
    <input
      type="number"
      value={limit}
      onChange={handleChange('limit', updateFilter)}
    />
  </div>
);}

export default FilterForm;