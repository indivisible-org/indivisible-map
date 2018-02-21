const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'circle-15-blue', filterBy: 'Lawmaker event', color: '#1cb7ec' },
    { icon: 'circle-15-red', filterBy: 'General', color: '#e31e21' },
    { icon: 'circle-15-green', filterBy: 'Other', color: '#31bf1b' },
    { icon: 'circle-15-purple', filterBy: false, color: '#a61cec' },
    { icon: 'circle-15-orange', filterBy: false, color: '#ebaf17' },
    { icon: 'circle-15-dark-blue', filterBy: false, color: '#1d79b1' },
    { icon: 'circle-15-fuchsia', filterBy: false, color: '#fa3af9' },
    { icon: 'circle-15-gray', filterBy: false, color: '#686868' },
  ],
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        allEvents: action.events,
      };
    default:
      return state;
  }
};

export default eventsReducer;
