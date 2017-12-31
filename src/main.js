import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import LoadingPage from './components/LoadingPage';
import { startSetEvents, startSetFeaturesHome } from './state/events/actions';
import { startSetGroups, startSetFeaturesHomeGroup } from './state/groups/actions';


import './style/app.scss';

const store = configureStore();

const url = window.location.href;

ReactDom.render(<LoadingPage />, document.getElementById('root'));

const getLocation = (currentUrl) => {
  if (url.includes('events')) {
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
  } else {                      // default to events for now [should default to renderApp() alone and be handled by PageNotFound]
    store.dispatch(startSetEvents())
      .then(store.dispatch(startSetFeaturesHome())
        .then(() => {
          renderApp();
        }));
  }
};

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

getLocation(url);
