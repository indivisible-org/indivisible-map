import superagent from 'superagent';

const requestData = function requestData(url) {
  return superagent
    .get(url)
    .catch(console.log)
};

export default requestData;
