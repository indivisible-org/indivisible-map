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
  ) => {
    console.log(
      filterBy,
      filterValue,
    );
    if (!filterValue || filterBy === 'all') {
      return allEvents;
    }
    return allEvents.filter((currrentEvent) => {
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
