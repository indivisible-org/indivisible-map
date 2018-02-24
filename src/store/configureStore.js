import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import events from '../state/events/reducers';
import groups from '../state/groups/reducers';
import selections from '../state/selections/reducers';


export default () => {
  const store = createStore(
    combineReducers({ events, groups, selections }),
    applyMiddleware(thunk),
  );
  return store;
};
