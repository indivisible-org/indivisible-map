import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
} from '../selections/selectors';

export const getEvents = state => state.events.allEvents;

// export default getVisibleEvents;
const getFilteredEvents = createSelector(
  [
    getEvents,
    getFilterBy,
    getFilterValue],
  (
    allEvents,
    filterBy,
    filterValue,
  ) => allEvents.filter((currrentEvent) => {
    if (filterBy === 'all') {
      return currrentEvent;
    }
    if (filterBy === 'zip' || filterBy === 'district') { // check if number
      if (currrentEvent[filterBy] === filterValue) {
        return currrentEvent;
      }
    }
    return currrentEvent[filterBy].toLowerCase().includes(filterValue.toLowerCase());
  }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1)),
);

export const getEventsByDistance = createSelector(
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
