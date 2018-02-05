const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'circle-15-purple', filter: false, color: '#1cb7ec' },
    { icon: 'circle-15-red', filter: false, color: '#a61cec' },
    { icon: 'circle-15-green', filter: false, color: '#e31e21' },
    { icon: 'circle-15-blue', filter: false, color: '#31bf1b' },
    { icon: 'circle-15-orange', filter: false, color: '#ebaf17' },
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
