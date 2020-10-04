import { uniqBy, filter, includes } from 'lodash';
import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
  getIssueFilters,
  getDistrict,
  getSelectedState,
  getEventScale,
} from '../selections/selectors';

export const getEvents = state => state.events.allEvents;
export const getColorMap = state => state.events.filterColors;
export const getCurrentIssueFocuses = createSelector([getEvents], events => uniqBy(events, 'issueFocus').map(item => item.issueFocus));

const getEventsFilteredByKeywordArray = createSelector(
  [getEvents, getIssueFilters],
  (allEvents, filterArray) => {
    if (filterArray === 'init') {
      return allEvents;
    }
    return filter(allEvents, o => includes(filterArray, o.issueFocus));
  },
);

const getEventsInState = createSelector(
  [getEventsFilteredByKeywordArray, getSelectedState],
  (eventsFilteredByKeywords, usState) => {
    if (!usState) {
      return eventsFilteredByKeywords;
    }
    return eventsFilteredByKeywords.filter(currrentEvent => currrentEvent.state === usState);
  },
);

export const getFilteredEvents = createSelector(
  [
    getEventsInState,
    getFilterBy,
    getFilterValue,
    getEventScale,
  ],
  (
    eventsFilteredByKeywords,
    filterBy,
    filterValue,
    eventScale,
  ) => {
    const eventsInScale = eventScale === 'all' ? eventsFilteredByKeywords : filter(eventsFilteredByKeywords, (event) => {
      if (eventScale === 'local') {
        return event.eventScale === eventScale;
      }
      return event.eventScale !== 'local';
    });
    if (!filterValue || filterBy === 'all') {
      return eventsInScale;
    }
    return eventsInScale.filter((currrentEvent) => {
      if (!currrentEvent[filterBy]) {
        return false;
      }
      return currrentEvent[filterBy].toLowerCase().includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.starts_at < b.starts_at ? -1 : 1));
  },
);

export const getVisibleEvents = createSelector(
  [
    getFilteredEvents,
    getDistance,
    getLocation,
  ],
  (
    filteredEvents,
    maxDistance,
    location,
  ) => {
    if (!location.LAT) {
      return filteredEvents;
    }
    const lookup = new LatLng(Number(location.LAT), Number(location.LNG));
    const maxMeters = maxDistance * 1609.34; // Convert miles to meters before filtering
    return filteredEvents.filter((currentEvent) => {
      const curDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(currentEvent.latitude), Number(currentEvent.longitude)),
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

export const getEventsByDistrict = createSelector(
  [
    getFilteredEvents,
    getDistrict,
  ],
  (
    filteredEvents,
    district,
  ) => {
    if (!district || district.toString().length === 0) {
      return filteredEvents;
    }
    return filter(filteredEvents, evnt => evnt.title.includes(`-${district.toString()})`) || evnt.title.includes('Senate'));
  },
);


export const getNumberTownHallsVisible = createSelector([getVisibleEvents], (visibleEvents) => {
  const townHalls = visibleEvents.filter(ele => ele.issueFocus === 'Town Hall' || ele.issueFocus === '2020 Candidate Event');
  return townHalls.length;
});

export const getNumberTownHallsInDistrict = createSelector([getEventsByDistrict], (inDistrict) => {
  const townHalls = inDistrict.filter(ele => ele.issueFocus === 'Town Hall' || ele.issueFocus === '2020 Candidate Event');
  return townHalls.length;
});