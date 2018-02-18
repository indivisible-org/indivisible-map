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
  let newId = 0;
  const batch = 500;

  const requestNext = (url, requested) => dispatch => getData(url).then((result) => {
    const response = result.body;
    const groups = Object.keys(response).map(id => response[id]);
    newId = groups[groups.length - 1].id;
    const total = groups.length + requested;
    dispatch(setGroups(groups));
    if (groups.length >= batch) {
      setTimeout(() => {
        const nextUrl = `${firebaseUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
        dispatch(requestNext(nextUrl, total));
      }, 200);
    }
  });

  const firstCall = () => (dispatch) => {
    const url = `${firebaseUrl}/indivisible_groups.json?orderBy="id"&limitToFirst=${batch}`;
    return getData(url).then((result) => {
      const response = result.body;
      const groups = Object.keys(response).map(id => response[id]);
      newId = groups[groups.length - 1].id;
      const total = groups.length;
      dispatch(setGroups(groups));
      setTimeout(() => {
        const nextUrl = `${firebaseUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
        dispatch(requestNext(nextUrl, total));
      }, 200);
    });
  };

  return dispatch(firstCall());
};
