import React from 'react';

// import FilterForm from './filter_form';
// import EmergencyIndex from './emergency_index';
import EmergencyMap from './../EmergencyMap/EmergencyMap';

class App extends React.Component {
  componentWillMount() {
    this.props.fetchEmergencies();
  }

  componentDidMount() {
    this.props.fetchEmergencies();
    // if(this.props.liveUpdates){
      // this.getLiveUpdates = setInterval(this.props.fetchEmergencies(), 2000);
    setInterval(this.props.fetchEmergencies, 2000);
    // }
  }

  filterEmergencies() {
    var filter = this.props.filter;
    var allowedTypes = [];
    var otherTypes = [];
    Object.keys(filter.types).forEach(type => {
      otherTypes.push(type);
      if(filter.types[type]){
        allowedTypes.push(type);
      }
    })

    // remove unnecessary types first
    var filteredEmergencies = []
    var allowedTypesRegex = new RegExp(allowedTypes.join('|'));
    var otherTypesRegex = new RegExp(otherTypes.join('|'));

    this.props.emergencies.forEach(emergency => {
      var typeMatch = emergency.description.match(allowedTypesRegex);
      var otherMatch = emergency.description.match(otherTypesRegex);
      if(typeMatch !== null){
        filteredEmergencies.push(emergency);
      }
      if(otherMatch === null){
        filteredEmergencies.push(emergency);
      }
    })

    return filteredEmergencies
  }

  render() {
    var _that = this;

    if(this.props.emergencies.length == 0){
      return <p>Loading....</p>
    }
    return (
      <div className="user-pane" >
        <div className="left-half">
          <EmergencyMap
            emergencies={_that.filterEmergencies()}
            filter={this.props.filter}
            liveUpdates={this.props.liveUpdates}
            fetchEmergencies={this.props.fetchEmergencies}
            updateFilter={this.props.updateFilter}
          />
        </div>
        <div className="right-half">

        </div>
      </div>
    )
  }
}
//
// const App = ({
//     emergencies,
//     filter,
//     liveUpdates,
//     fetchEmergencies,
//     updateFilter,
//     toggleLiveUpdates
//   }) => (
//     <div className="user-pane" >
//       <div className="left-half">
//         <EmergencyMap
//           emergencies={emergencies}
//           filter={filter}
//           liveUpdates={liveUpdates}
//           fetchEmergencies={fetchEmergencies}
//           updateFilter={updateFilter}
//         />
//       </div>
//       <div className="right-half">
//
//       </div>
//     </div>
//   )

export default App;
