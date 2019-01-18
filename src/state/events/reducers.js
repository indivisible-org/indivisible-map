const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'town-hall-icon', filterBy: 'Town Hall', color: '#4E937A' },
    { icon: 'general-icon', filterBy: 'General', color: '#6C9FC2' },
    { icon: 'other-icon', filterBy: 'Other', color: '#2D4C6B' },
    { icon: 'foreign-policy-icon', filterBy: 'Foreign Policy', color: '#FF9F2C' },
    { icon: 'trump-tax-scam-icon', filterBy: false, color: '#365061' },
    { icon: 'gun-violence-icon', filterBy: false, color: '#7B3491' },
    { icon: 'electoral-icon', filterBy: false, color: '#652524' },
    { icon: 'dream-act-icon', filterBy: false, color: '#CA4948' },
    { icon: 'infrastructure-icon', filterBy: false, color: '#172636' },
    { icon: 'dark-orange', filterBy: false, color: '#DB8011' },
    { icon: 'dark-purple', filterBy: false, color: '#3E1A49' },
    { icon: 'dark-green', filterBy: false, color: '#274A3D' },
    { icon: 'general-icon', filterBy: false, color: '#6C9FC2' },
    { icon: 'general-icon', filterBy: false, color: '#6C9FC2' },
    { icon: 'general-icon', filterBy: false, color: '#6C9FC2' },
    { icon: 'general-icon', filterBy: false, color: '#6C9FC2' },
  ],
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        allEvents: [...state.allEvents, ...action.events],
      };
    case 'UPDATE_COLORS':
      return {
        ...state,
        filterColors: action.colorMap,
      };
    default:
      return state;
  }
};

export default eventsReducer;
