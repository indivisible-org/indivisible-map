import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import events from '../state/events/reducers';
import groups from '../state/groups/reducers';
import filters from '../state/filters/reducers';


export default () => {
  const store = createStore(
    combineReducers({ events, groups, filters }),
    applyMiddleware(thunk),
  );
  return store;
};
