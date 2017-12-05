import superagent from 'superagent';

const requestData = function requestData(url) {
  return superagent
    .get(url);
};

export default requestData;
