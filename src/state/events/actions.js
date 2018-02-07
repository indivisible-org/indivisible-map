import moment from 'moment';

import getData from '../../logics/getData';
import Point from '../../logics/features';

import { firebaseUrl } from '../constants';

import IndEvent from './model';

export const setEvents = events => ({
  type: 'SET_EVENTS',
  events,
});

export const setFeaturesHome = featuresHome => ({
  type: 'SET_FEATURES_HOME',
  featuresHome,
});

// NEEDS FIX: 2 separate calls for featuresHome and events

export const startSetEvents = () => (dispatch) => {
  const url = `${firebaseUrl}/indivisible_public_events.json`;
  return getData(url).then((result) => {
    const events = Object.keys(result.body)
      .map(id => new IndEvent(result.body[id]))
      .filter(evnt => moment(evnt.starts_at).isAfter())
      .sort((a, b) => moment(a.starts_at).isSameOrAfter(b.starts_at));
    return (dispatch(setEvents(events)));
  });
};

export const startSetFeaturesHome = () => (dispatch) => {
  const url = `${firebaseUrl}/indivisible_public_events.json`;
  return getData(url).then((result) => {
    const events = Object.keys(result.body).map(id => result.body[id]);
    const featuresHome = {
      type: 'FeatureCollection',
      features: [],
    };

    featuresHome.features = events.map((indEvent) => {
      const newFeature = new Point(indEvent);
      return newFeature;
    });
    dispatch(setFeaturesHome(featuresHome));
  });
};
