import getData from '../../logics/getData';
import { indivisibleUrl } from '../constants';

export const setGroups = groups => ({
  groups,
  type: 'SET_GROUPS',
});

export const setFeaturesHome = featuresHome => ({
  featuresHome,
  type: 'SET_FEATURES_HOME_GROUP',
});

export const selectGroup = group => ({
  group,
  type: 'SELECT_GROUP',
});

export const startSetGroups = () => (dispatch) => {
  let newId = 0;
  const batch = 500;

  const requestNext = (url, requested) => storedispatch => getData(url).then((result) => {
    const response = result.body;
    const groups = Object.keys(response).map(id => response[id]);
    newId = groups[groups.length - 1].id;
    const total = groups.length + requested;
    storedispatch(setGroups(groups));
    if (groups.length >= batch) {
      setTimeout(() => {
        const nextUrl = `${indivisibleUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
        storedispatch(requestNext(nextUrl, total));
      }, 10);
    }
  });

  const firstCall = () => (storedispatch) => {
    const url = `${indivisibleUrl}/indivisible_groups.json?orderBy="id"&limitToFirst=${batch}`;
    return getData(url).then((result) => {
      const response = result.body;
      const groups = Object.keys(response).map(id => response[id]);
      newId = groups[groups.length - 1].id;
      const total = groups.length;
      storedispatch(setGroups(groups));
      setTimeout(() => {
        const nextUrl = `${indivisibleUrl}/indivisible_groups.json?orderBy="$key"&startAt="${newId}"&limitToFirst=${batch}`;
        storedispatch(requestNext(nextUrl, total));
      }, 10);
    });
  };

  return dispatch(firstCall());
};
