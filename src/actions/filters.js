// Set text filter
export const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text,
});

export const sortByZip = zip => ({
  type: 'SORT_BY_ZIP',
  zip
});

export const sortByType = type => ({
  type: 'SORT_BY_TYPE',
  type
});

export const sortByDistrict = district => ({
  type: 'SORT_BY_DISTRICT',
  district
});

export const sortByDate = () => ({
  type: 'SORT_BY_DATE',
});
