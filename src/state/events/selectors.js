import { uniqBy, filter, includes } from 'lodash';
import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
  getFilters,
} from '../selections/selectors';

export const getEvents = state => state.events.allEvents;

const getEventsFilteredByKeywordArray = createSelector(
  [getEvents, getFilters],
  (allEvents, filterArray) => {
    if (filterArray === 'init') {
      return allEvents;
    }
    return filter(allEvents, o => includes(filterArray, o.issueFocus));
  },
);
// export default getVisibleEvents;
const getFilteredEvents = createSelector(
  [
    getEventsFilteredByKeywordArray,
    getFilterBy,
    getFilterValue,
  ],
  (
    eventsFilteredByKeywords,
    filterBy,
    filterValue,
  ) => {
    if (!filterValue || filterBy === 'all') {
      return eventsFilteredByKeywords;
    }
    return eventsFilteredByKeywords.filter((currrentEvent) => {
      if (!currrentEvent[filterBy]) {
        return false;
      }
      if (filterBy === 'district') { // check if number
        return currrentEvent[filterBy] === filterValue;
      }

      return currrentEvent[filterBy].toLowerCase().includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1));
  },
);

export const getVisbleEvents = createSelector(
  [
    getFilteredEvents,
    getDistance,
    getLocation],
  (
    filteredEvents,
    maxDistance,
    location,
  ) => {
    if (!location) {
      return filteredEvents;
    }
    const lookup = new LatLng(location.LAT, location.LNG);
    return filteredEvents.filter((currentEvent) => {
      const curDistance = computeDistanceBetween(
        lookup,
        new LatLng(currentEvent.latitude, currentEvent.longitude),
      );
      return curDistance < maxDistance;
    });
  },
);


export const getCurrentIssueFocuses = createSelector([getEvents], events => uniqBy(events, 'issueFocus').map(item => item.issueFocus));
