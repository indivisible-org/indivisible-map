import getData from '../../logics/getData';
import Point from '../../logics/features';

export const setGroups = groups => ({
  type: 'SET_GROUPS',
  groups,
});

export const setFeaturesHome = featuresHome => ({
  type: 'SET_FEATURES_HOME_GROUP',
  featuresHome,
});

export const startSetGroups = () => {
  return (dispatch) => {
    const url = 'group-dummy-data.json';
    return getData(url).then((result) => {
      const response = JSON.parse(result.text);
      const groups = Object.keys(response).map(id => response[id]);
      dispatch(setGroups(groups)); 
    });
  };
};

export const startSetFeaturesHomeGroup = () => {
  return (dispatch) => {
    const url = 'group-dummy-data.json';
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

