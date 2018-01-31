const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'circle-15-purple', filter: false },
    { icon: 'circle-15-red', filter: false },
    { icon: 'circle-15-green', filter: false },
    { icon: 'circle-15-blue', filter: false },
    { icon: 'circle-15-orange', filter: false },
  ],
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        allEvents: action.events,
      };
    case 'SET_FEATURES_HOME':
      return {
        ...state,
        featuresHome: action.featuresHome,
      };
    default:
      return state;
  }
};

export default eventsReducer;
