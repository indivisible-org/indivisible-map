const initialState = {
  allEvents: [],
  filterColors: [
    { icon: 'town-hall-icon', filterBy: 'Town Hall', color: '#4E937A' },
    { icon: 'general-icon', filterBy: 'General', color: '#6C9FC2' },
    { icon: 'other-icon', filterBy: 'Other', color: '#2D4C6B' },
    { icon: 'gun-violence-icon', filterBy: 'Gun Violence', color: '#7B3491' },
    { icon: 'foreign-policy-icon', filterBy: 'Foreign Policy', color: '#FF9F2C' },
    { icon: 'infrastructure-icon', filterBy: 'Mueller/Rosenstein', color: '#172636' },
    { icon: 'electoral-icon', filterBy: '2018 Elections', color: '#652524' },
    { icon: 'trump-tax-scam-icon', filterBy: 'Trump Tax Scam', color: '#365061' },
    { icon: 'dream-act-icon', filterBy: 'DREAM Act', color: '#CA4948' },
    { icon: 'dark-orange', filterBy: false, color: '#DB8011' },
    { icon: 'dark-purple', filterBy: false, color: '#3E1A49' },
    { icon: 'dark-green', filterBy: false, color: '#274A3D' },
    { icon: 'circle-stroked-15-grey', filterBy: false, color: '#686868' },
  ],
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        allEvents: action.events,
      };
    case 'UPDATE_COLORS':
      return {
        ...state,
        filterColors: action.colorMap,
      }
    default:
      return state;
  }
};

export default eventsReducer;
