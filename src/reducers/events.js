const eventsReducerDefaultState = [];

const eventsReducer = (state = eventsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return action.events;
    case 'SET_FEATURES_HOME':
      return action.featuresHome;
    default:
      return state;
  }
}

export default eventsReducer;
