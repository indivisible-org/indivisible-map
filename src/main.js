import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Pram from 'pram';
import { find, isArray } from 'lodash';

import selectionStateBranch from './state/selections';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

import './style/app.scss';
import { urlSearchParams } from './utils/urlParam';
import states from './data/states';

const store = configureStore();
const history = createHistory();
const pram = new Pram(history);

const params = pram.getParams();
console.log('params', params);
if (params[urlSearchParams.refCode]) {
  store.dispatch(selectionStateBranch.actions.setRefCode(params[urlSearchParams.refCode]));
}

if (params[urlSearchParams.issueFilter]) {
  let issueFilters = params[urlSearchParams.issueFilter];
  if (!isArray(issueFilters)) {
    issueFilters = issueFilters.split(',');
  }
  store.dispatch(selectionStateBranch.actions.setIssueTypeFilters(issueFilters));
}

if (params[urlSearchParams.location]) {
  const location = params[urlSearchParams.location];
  if (find(states, ele => ele.USPS === location)) {
    store.dispatch(selectionStateBranch.actions.setUsState(location));
  }
}

if (params[urlSearchParams.sParam]) {
  const sParam = params[urlSearchParams.sParam];
  store.dispatch(selectionStateBranch.actions.setSParam(sParam));
}

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();
