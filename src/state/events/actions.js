import getData from '../../logics/getData';
import Point from '../../logics/features';

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
  const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
  return getData(url).then((result) => {
    const response = JSON.parse(result.text);
    const events = Object.keys(response).map(id => response[id]);
    dispatch(setEvents(events));
  });
};

export const startSetFeaturesHome = () => (dispatch) => {
  const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
  return getData(url).then((result) => {
    const response = JSON.parse(result.text);
    const events = Object.keys(response).map(id => response[id]);
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
