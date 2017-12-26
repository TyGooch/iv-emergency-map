import React from 'react';
import { Provider } from 'react-redux';
// 
import EmergencyMapContainer from './EmergencyMap/EmergencyMapContainer';
// import SessionFormContainer from './session_form/session_form_container';
// import SearchContainer from './search/search_container';
// import BenchShowContainer from './bench_show/bench_show_container';
// import BenchFormContainer from './bench_form/bench_form_container';
// import { AuthRoute, ProtectedRoute } from '../util/route_util';

// const App = () => (
//   <div>
//     <header>
//       Isla Vista Emergencies
//     </header>
//     <EmergencyMapContainer />
//   </div>
// );

class App extends React.Component {
  componentWillMount() {
    
  }
  componentDidMount() {
    console.log("poop");
    debugger;
  }
  render() {
    return(
      <div>
        <header>
          Isla Vista Emergencies
        </header>
        <EmergencyMapContainer />
      </div>
    )
  }
}

export default App;