import getData from '../logics/getData';
import Point from '../logics/features';

export const setEvents = events => ({
  type: 'SET_EVENTS',
  events,
});

export const setFeaturesHome = featuresHome => ({
  type: 'SET_FEATURES_HOME',
  featuresHome,
});

// NEEDS FIX: 2 separate calls for featuresHome and events --> make less redundant 

export const startSetEvents = () => {
  return (dispatch) => {
    const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
    return getData(url).then((result) => {
      const response = JSON.parse(result.text);
      const events = Object.keys(response).map(id => response[id]);
      // this.setState({ featuresHome });
      // this.setState({ events });
      // console.log(events);
      // map.getSource('event-points').setData(featuresHome);
      dispatch(setEvents(events)); // saving events in array -> may change to object
      // dispatch(setFeaturesHome({ featuresHome }));
      // dispatch to set featuresHome
      // need to access map to setData on map
      // or handle setData method inside of component
    });
  };
};

export const startSetFeaturesHome = () => {
  return (dispatch) => {
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
};