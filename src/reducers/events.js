const eventsReducerDefaultState = [];

const eventsReducer = (state = eventsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.events,
      }
    case 'SET_FEATURES_HOME':
      return {
        ...state,
        featuresHome: action.featuresHome,
      }
    default:
      return state;
  }
};

export default eventsReducer;
