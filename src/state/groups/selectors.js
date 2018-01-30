import { createSelector } from 'reselect';

import { getFilterBy, getFilterValue } from '../selections/selectors';

export const getGroups = state => state.groups.allGroups;

export const getFilteredGroups = createSelector(
  [
    getGroups,
    getFilterBy,
    getFilterValue,
  ],
  (
    allGroups,
    filterBy,
    filterValue,
  ) => allGroups.filter((currrentGroup) => {
    if (filterBy === 'all') {
      return currrentGroup;
    }
    if (filterBy === 'zip' || filterBy === 'district') { // check if number
      if (currrentGroup[filterBy] === filterValue) {
        return currrentGroup;
      }
    }
    return currrentGroup[filterBy].toLowerCase().includes(filterValue.toLowerCase());
  }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1)),
);
