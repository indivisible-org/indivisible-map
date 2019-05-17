import { createSelector } from 'reselect';
import { urlSearchParams } from '../../utils/urlParam';

export const getDistance = state => state.selections.distance;
export const getLocation = state => state.selections.location;
export const getFilterBy = state => state.selections.filterBy;
export const getFilterValue = state => state.selections.filterValue;
export const getIssueFilters = state => state.selections.issueTypeFilters;
export const getRefCode = state => state.selections.refcode;
export const getSearchType = state => state.selections.searchType;
export const getDistrict = state => state.selections.district;
export const getSelectedState = state => state.selections.usState;
export const getError = state => state.selections.error;
export const getSParam = state => state.selections.sParam;

export const getRsvpParams = createSelector([getRefCode, getSParam], (refCode, sParam) => {
  if (refCode && sParam) {
    return `${urlSearchParams.refCode}=${refCode}&${urlSearchParams.sParam}=${sParam}`;
  }
  if (refCode) {
    return `${urlSearchParams.refCode}=${refCode}`;
  }
  if (sParam) {
    return `${urlSearchParams.sParam}=${sParam}`;
  }
  return '';
});
