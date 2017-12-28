import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as events from '../reducers/events';
import * as groups from '../reducers/groups';
import * as filters from '../reducers/filters';

export default () => {
  const store = createStore(
    combineReducers({ events, groups, filters }),
    applyMiddleware(thunk),
  );
  return store;
};
