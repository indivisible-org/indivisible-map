import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import eventsReducer from '../reducers/events';
import groupsReducer from '../reducers/groups';
import filtersReducer from '../reducers/filters';

export default () => {
  const store = createStore(
    combineReducers({
      eventState: eventsReducer,
      groupState: groupsReducer,
      filterState: filtersReducer,
    }),
    applyMiddleware(thunk),
  );
  return store;
};
