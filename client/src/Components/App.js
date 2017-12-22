import React from 'react';
import { Provider } from 'react-redux';
// import {
//   Route,
//   Redirect,
//   Switch,
//   Link,
//   HashRouter
// } from 'react-router-dom';

import SearchContainer from './Search/SearchContainer';
// import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = () => (
  <div>
    <header>
      <h1>Isla Vista Emergencies</h1>
    </header>
    <SearchContainer />
  </div>
);

export default App;
