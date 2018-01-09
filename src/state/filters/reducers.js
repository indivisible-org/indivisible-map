import moment from 'moment';

const initialState = {
  text: '',
  sortBy: 'all',
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text,
      };
    case 'SORT_BY':
      return {
        ...state,
        sortBy: action.val,
      };
    default:
      return state;
  }
};

export default filtersReducer;
