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

let requested = 0;
let newId = 0;
const batch = 500;

const requestNext = url => dispatch => getData(url).then((result) => {
  const response = result.body;
  const groups = Object.keys(response).map(id => response[id]);
  newId = groups[groups.length - 1].id;
  requested += groups.length;
  dispatch(setGroups(groups));
  if (groups.length >= batch) {
    const nextUrl = `${firebaseUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
    dispatch(requestNext(nextUrl));
  }
});

export const startSetGroups = () => (dispatch) => {
  const url = `${firebaseUrl}/indivisible_groups.json?orderBy="id"&limitToFirst=${batch}`;
  return getData(url).then((result) => {
    const response = result.body;
    const groups = Object.keys(response).map(id => response[id]);
    newId = groups[groups.length - 1].id;
    requested += groups.length;
    dispatch(setGroups(groups));
    if (requested < 6068) {
      const nextUrl = `${firebaseUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
      dispatch(requestNext(nextUrl));
    }
  });
};
