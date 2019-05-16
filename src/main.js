import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Pram from 'pram';
import { find } from 'lodash';
import { MessageTarget } from '@aics/browsing-context-messaging';

import selectionStateBranch from './state/selections';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

import './style/app.scss';
import { UrlSearchParams } from './utils/urlParam';
import states from './data/states';

const store = configureStore();
const history = createHistory();
const pram = new Pram(history);

const params = pram.getParams();
if (params[UrlSearchParams.refCode]) {
  console.log('setting ref', params[UrlSearchParams.refCode]);
  store.dispatch(selectionStateBranch.actions.setRefCode(params[UrlSearchParams.refCode]));
}

if (params[UrlSearchParams.issueFilter]) {
  const issueFilters = params[UrlSearchParams.issueFilter].split(',');
  store.dispatch(selectionStateBranch.actions.setIssueTypeFilters(issueFilters));
}

if (params[UrlSearchParams.location]) {
  const location = params[UrlSearchParams.location];
  if (find(states, ele => ele.USPS === location)) {
    store.dispatch(selectionStateBranch.actions.setUsState(location));
  }
}
const messenger = new MessageTarget(((messageEvent) => {
  console.log(messageEvent.data);
}));

pram.onChange((urlParams) => {
  try {
    messenger.postMessage(urlParams);
  } catch (error) {
    // swallow
  }
});

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();
