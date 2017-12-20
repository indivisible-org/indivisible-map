import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import eventsReducer from '../reducers/events';
import groupsReducer from '../reducers/groups';
import filtersReducer from '../reducers/filters';

export default () => {
  const store = createStore(
    combineReducers({
      events: eventsReducer,
      groups: groupsReducer,
      filters: filtersReducer,
    }),
    applyMiddleware(thunk),
  );
  return store;
};
