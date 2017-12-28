import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { startSetEvents, startSetFeaturesHome } from './actions/events';
import { startSetGroups, startSetFeaturesHomeGroup } from './actions/groups';


import './style/app.scss';

const store = configureStore();

const url = window.location.href;

ReactDom.render(<div>loading</div>, document.getElementById('root'));

const jsx = (
  <Provider store={store}>
    <AppRouter getLocation={getLocation}/>
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

const getLocation = (currentUrl) => {
  if (url.includes('events')) {
    // need to set events and features home
    store.dispatch(startSetEvents())
      .then(store.dispatch(startSetFeaturesHome())
        .then(() => {
          renderApp();
        }));
  } else if (url.includes('groups')) {
    store.dispatch(startSetGroups())
      .then(store.dispatch(startSetFeaturesHomeGroup())
        .then(() => {
          renderApp();
        }));
  } else {
    renderApp();
  };
};

getLocation(url);