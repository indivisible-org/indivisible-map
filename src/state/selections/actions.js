import superagent from 'superagent';

import { firebaseUrl } from '../constants';

const setLatLng = payload => ({
  type: 'SET_LAT_LNG',
  payload,
});

export const setRefCode = (payload = '') => ({
  type: 'SET_REFCODE',
  payload,
});

export const setTextFilter = (payload = '') => ({
  type: 'SET_TEXT_FILTER',
  payload,
});

export const setDistance = (payload = 80467) => ({
  type: 'SET_DISTANCE',
  payload,
});

export const searchByQueryString = payload => ({
  type: 'SEARCH_BY_KEY_VALUE',
  payload,
});

export const setFilters = payload => ({
  type: 'SET_FILTERS',
  payload,
});

export const setInitialFilters = payload => ({
  type: 'SET_INITIAL_FILTERS',
  payload,
});

export const getLatLngFromZip = payload => (dispatch) => {
  if (!payload.zipcode) {
    return dispatch(setLatLng(null));
  }
  return superagent.get(`${firebaseUrl}/zips/${payload.zipcode}.json`)
    .then((res) => {
      dispatch(setLatLng(res.body));
    })
    .catch();
};
