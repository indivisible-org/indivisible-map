import superagent from 'superagent';

import { firebaseUrl } from '../constants';

export const setLatLng = payload => ({
  payload: payload || {},
  type: 'SET_LAT_LNG',
});

export const searchByDistrict = payload => ({
  payload,
  type: 'SEARCH_BY_DISTRICT',
});

export const setUsState = payload => ({
  payload,
  type: 'SET_US_STATE',
});

export const resetSelections = () => ({
  type: 'RESET_SELECTIONS',
});

export const resetSearchByZip = () => ({
  type: 'RESET_LAT_LNG',
});

export const setRefCode = (payload = '') => ({
  payload,
  type: 'SET_REFCODE',
});

export const setTextFilter = (payload = '') => ({
  payload,
  type: 'SET_TEXT_FILTER',
});

export const setDistance = (payload = 50) => ({
  payload,
  type: 'SET_DISTANCE',
});

export const searchByQueryString = payload => ({
  payload,
  type: 'SEARCH_BY_KEY_VALUE',
});

export const resetSearchByQueryString = () => ({
  type: 'RESET_SEARCH_BY_KEY_VALUE',
});

export const setFilters = payload => ({
  payload,
  type: 'SET_FILTERS',
});

export const changeSearchType = payload => ({
  payload,
  type: 'SET_SEARCH_TYPE',
});

export const setInitialFilters = payload => ({
  payload,
  type: 'SET_INITIAL_FILTERS',
});

export const setError = payload => ({
  payload,
  type: 'SET_ERROR_MESSAGE',
});

export const getLatLngFromZip = payload => (dispatch) => {
  if (!payload.query) {
    return dispatch(setLatLng({}));
  }
  return superagent.get(`${firebaseUrl}/zips/${payload.query}.json`)
    .then((res) => {
      if (!res.body) {
        dispatch(setError(`The ${payload.query} zip code isn't in our database.`));
      } else {
        dispatch(setLatLng(res.body));
      }
    })
    .catch(setError('Zip code lookup failed.'));
};
