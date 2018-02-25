import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
} from '../selections/selectors';

export const getGroups = state => state.groups.allGroups;
export const getSelectedGroup = state => state.groups.selectedGroup;

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
    });
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
    }).sort((a, b) => {
      const aDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(a.latitude), Number(a.longitude)),
      );
      const bDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(b.latitude), Number(b.longitude)),
      );
      return aDistance - bDistance;
    });
  },
);
