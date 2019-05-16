import { uniqBy } from 'lodash';

const initialState = {
  distance: 50,
  district: NaN,
  error: '',
  filterBy: 'all',
  filterValue: '',
  issueTypeFilters: 'init',
  location: {},
  refcode: '',
  searchType: 'proximity',
  usState: '',
  zipcode: '',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'RESET_SELECTIONS':
      return {
        ...state,
        district: initialState.district,
        error: initialState.error,
        filterBy: initialState.filterBy,
        filterValue: initialState.filterValue,
        location: initialState.location,
      };
    case 'SET_REFCODE':
      return {
        ...state,
        refcode: payload,
      };
    case 'SET_US_STATE':
      return {
        ...state,
        usState: payload,
      };
    case 'SEARCH_BY_DISTRICT':
      return {
        ...state,
        district: payload.district,
        filterBy: 'state',
        filterValue: payload.state,
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
        error: initialState.error,
        location: payload,
      };
    case 'RESET_LAT_LNG':
      return {
        ...state,
        error: initialState.error,
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
    case 'SET_ISSUE_TYPE_FILTERS':
      return {
        ...state,
        issueTypeFilters: payload,
      };
    case 'SET_SEARCH_TYPE':
      return {
        ...state,
        district: initialState.district,
        searchType: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        issueTypeFilters: uniqBy(payload.events, 'issueFocus')
          .map(item => item.issueFocus),
        // turn back on to filter out town halls by default
        // .filter(item => item !== 'Town Hall'),
      };
    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

export default filtersReducer;
