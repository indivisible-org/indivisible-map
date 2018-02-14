const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'circle-15-purple', filterBy: false, color: '#a61cec' },
    { icon: 'circle-15-red', filterBy: false, color: '#e31e21' },
    { icon: 'circle-15-green', filterBy: false, color: '#31bf1b' },
    { icon: 'circle-15-blue', filterBy: false, color: '#1cb7ec' },
    { icon: 'circle-15-orange', filterBy: false, color: '#ebaf17' },
    { icon: 'circle-15-fuchsia', filterBy: false, color: '#ebaf17' },
    { icon: 'Circle-15-dark-blue', filterBy: false, color: '#161547' },
    { icon: 'Circle-15-gray', filterBy: false, color: '#686868' },
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
