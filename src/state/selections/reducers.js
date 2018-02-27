import { uniqBy, indexOf } from 'lodash';
import { townhallevents } from '../constants';

const initialState = {
  filterValue: '',
  district: '',
  location: {},
  distance: 50,
  filterBy: 'all',
  filters: 'init',
  zipcode: '',
  state: '',
  refcode: '',
  searchType: 'proximity',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'RESET_SELECTIONS':
      return {
        ...state,
        location: initialState.location,
        filterBy: initialState.filterBy,
        filterValue: initialState.filterValue,
        district: initialState.district,
      };
    case 'SET_REFCODE':
      return {
        ...state,
        refcode: payload,
      };
    case 'SEARCH_BY_DISTRICT':
      let updateFilters = [...state.filters];
      if (indexOf(state.filters, townhallevents) === -1) {
        updateFilters = [...updateFilters, townhallevents];
      }
      return {
        ...state,
        district: payload.district,
        filterBy: 'state',
        filterValue: payload.state,
        filters: updateFilters,
      };
    case 'SET_TEXT_FILTER':
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
    case 'RESET_LAT_LNG':
      return {
        ...state,
        location: {},
      };
    case 'SEARCH_BY_KEY_VALUE':
      return {
        ...state,
        filterBy: payload.filterBy,
        filterValue: payload.filterValue,
      };
    case 'RESET_SEARCH_BY_KEY_VALUE':
      return {
        ...state,
        filterBy: initialState.filterBy,
        filterValue: initialState.filterValue,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: payload,
      };
    case 'SET_SEARCH_TYPE':
      return {
        ...state,
        searchType: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload.events, 'issueFocus')
          .map(item => item.issueFocus)
          .filter(item => item !== 'Town Hall'),
      };
    default:
      return state;
  }
};

export default filtersReducer;
