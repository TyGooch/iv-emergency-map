import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './App/AppContainer';

import'./root.css'

const Root = ({ store }) => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

export default Root;
