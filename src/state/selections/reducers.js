const initialState = {
  filterValue: '',
  location: '',
  distance: 80467.2,
  filterBy: 'all',
  zipcode: '',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_TEXT_FILTER':
      console.log('resetting', payload);
      return {
        ...state,
        filterValue: payload,
      };
    case 'SET_DISTANCE':
      return {
        ...state,
        distance: payload,
      };
    case 'SET_LAT_LNG':
      return {
        ...state,
        location: payload,
      };
    case 'SORT_BY':
      console.log('chaging', payload);

      return {
        ...state,
        filterBy: payload,
      };
    default:
      return state;
  }
};

export default filtersReducer;
