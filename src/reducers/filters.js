import moment from 'moment';

const initialState = {
  text: '',
  sortBy: 'date',
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default filtersReducer;
