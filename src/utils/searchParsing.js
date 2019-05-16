import { find } from 'lodash';
import states from '../data/states';

export function isZipCode(query) {
  const zipCodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
  return query.match(zipCodeRegEx);
}

export function isState(query) {
  return find(states, state =>
    state.USPS.toLowerCase().trim() === query.toLowerCase().trim() ||
          state.Name.toLowerCase().trim() === query.toLowerCase().trim());
}
