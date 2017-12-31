import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import eventsReducer from '../state/events/reducers';
import groupsReducer from '../state/groups/reducers';
import filtersReducer from '../state/filters/reducers';

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
