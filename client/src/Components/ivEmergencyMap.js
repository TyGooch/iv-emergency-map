//React
import React from 'react';
import ReactDOM from 'react-dom';
//Components
import Root from './components/root';
import configureStore from './Store/store';


document.addEventListener('DOMContentLoaded', () => {
  let store;
  // if (window.currentUser) {
  //   const preloadedState = { emergencies: { }, filter: { maxNumEmergencies: 10  } };
  //   store = configureStore(preloadedState);
  //   delete window.currentUser;
  // } else {
    store = configureStore();
  // }
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});
