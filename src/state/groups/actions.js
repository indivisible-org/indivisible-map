import getData from '../../logics/getData';
import { firebaseUrl } from '../constants';

export const setGroups = groups => ({
  type: 'SET_GROUPS',
  groups,
});

export const setFeaturesHome = featuresHome => ({
  type: 'SET_FEATURES_HOME_GROUP',
  featuresHome,
});

export const startSetGroups = () => (dispatch) => {
  const url = `${firebaseUrl}/indivisible_groups.json`;
  return getData(url).then((result) => {
    const response = JSON.parse(result.text);
    const groups = Object.keys(response).map(id => response[id]);
    return dispatch(setGroups(groups));
  });
};
