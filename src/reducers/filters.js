import moment from 'moment';

const filtersReducerDefaultState = {
  text: '',
  sortBy: 'date',
  zip: null,
  type: '',
  district: null,
};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text,
      };
    case 'SORT_BY_ZIP':
      return {
        ...state,
        zip: action.zip,
      };
    default:
      return state;
  }
}

export default filtersReducer;
