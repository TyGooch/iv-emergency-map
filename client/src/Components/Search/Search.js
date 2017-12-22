import React from 'react';

// import FilterForm from './filter_form';
// import EmergencyIndex from './emergency_index';
import EmergencyMap from './../EmergencyMap/EmergencyMap';
import style from './style';

const Search = ({ emergencies, filter, fetchEmergencies, updateFilter }) => (
  <div className="user-pane" style={style.UserPane}>
    <div className="left-half">
      <EmergencyMap
        emergencies={emergencies}
        filter={filter}
        fetchEmergencies={fetchEmergencies}
        updateFilter={updateFilter}
      />
    </div>
    <div className="right-half">

    </div>
  </div>
);

export default Search;
