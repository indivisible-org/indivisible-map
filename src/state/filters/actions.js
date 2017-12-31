// Set text filter
export const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text,
});

export const sortByChange = val => ({
  type: 'SORT_BY',
  val,
});