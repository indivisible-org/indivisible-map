
/* global __DEBUG__ */
export default store => next => (action) => {
  try {
    const result = next(action);
    if (__DEBUG__) { console.log('__STATE__', store.getState()); }
    return result;
  } catch (error) {
    error.action = action;
    console.log('__ACTION__', action);
    console.error('__ERROR__', error.message);
    return error;
  }
};
