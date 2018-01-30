import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import middleware from '../state/middleware';

import events from '../state/events/reducers';
import groups from '../state/groups/reducers';
import selections from '../state/selections/reducers';


export default () => {
  const store = createStore(
    combineReducers({ events, groups, selections }),
    applyMiddleware(middleware.reporter, thunk),
  );
  return store;
};
