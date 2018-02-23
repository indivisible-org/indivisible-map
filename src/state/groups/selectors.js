import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
} from '../selections/selectors';

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
  ) => {
    console.log('filterBy', filterBy);
    if (filterBy === 'all') {
      return allGroups;
    }
    return allGroups.filter((currrentGroup) => {
      if (!currrentGroup[filterBy]) {
        return false;
      }
      if (filterBy === 'district') { // check if number
        return currrentGroup[filterBy] === filterValue;
      }
      return currrentGroup[filterBy].toLowerCase().includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1));
  },
);


export const getVisbleGroups = createSelector(
  [
    getFilteredGroups,
    getDistance,
    getLocation,
  ],
  (
    filteredGroups,
    maxDistance,
    location,
  ) => {
    if (!location.LAT) {
      return filteredGroups;
    }
    const lookup = new LatLng(Number(location.LAT), Number(location.LNG));
    const maxMeters = maxDistance * 1609.34; // Convert miles to meters before filtering
    return filteredGroups.filter((currentGroup) => {
      if (!(currentGroup.latitude) || !(currentGroup.longitude)) {
        return false;
      }
      const curDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(currentGroup.latitude), Number(currentGroup.longitude)),
      );
      return curDistance < maxMeters;
    });
  },
);
