import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { fetchEmergencies } from '../../Actions/emergencyActions';
import { updateFilter } from '../../Actions/filterActions';
import { toggleLiveUpdates } from '../../Actions/liveUpdatesActions';
import { asArray } from '../../Reducers/selectors';
import App from './App';

const mapStateToProps = state => ({
  emergencies: state.emergencies,
  filter: state.filter,
  liveUpdates: state.liveUpdates
});

const mapDispatchToProps = dispatch => ({
  // fetchEmergencies: (filter) => dispatch(fetchEmergencies(filter)),
  fetchEmergencies: () => dispatch(fetchEmergencies()),
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value)),
  toggleLiveUpdates: () => dispatch(toggleLiveUpdates())
});

// class AppContainer extends React.Component {
//   constructor(props) {
//     super(props)
//     var getLiveUpdates;
//     this.getLiveUpdates = getLiveUpdates;
//   }
//
//   componentDidMount() {
//     this.props.fetchEmergencies(this.props.filter);
//
//     if(this.props.liveUpdates){
//       this.getLiveUpdates = setInterval(this.props.fetchEmergencies(this.props.filter), 2000);
//     }
//   }
//
//   componentDidUpdate(prevProps, prevState) {
//     clearInterval(this.getLiveUpdates);
//   }
//
//   render() {
//     return(
//       <App
//         emergencies={this.props.emergencies}
//         filter={this.props.filter}
//         liveUpdates={this.props.liveUpdates}
//         fetchEmergencies={this.props.fetchEmergencies}
//         updateFilter={this.props.updateFilter}
//         toggleLiveUpdates={this.props.toggleLiveUpdates}
//       />
//     )
//   }
// }

// const App = ({
//     emergencies,
//     filter,
//     liveUpdates,
//     fetchEmergencies,
//     updateFilter,
//     toggleLiveUpdates
//   }) => (
//     <div className="user-pane" style={style.UserPane}>
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

// class App extends React.Component {
//
// }


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
