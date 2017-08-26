const axios = require('axios');
const moment = require('moment');
const crypto = require('crypto');

const shasum = crypto.createHash('sha1');
const API_URL = 'https://debrid-link.fr/';
const data = {};
const header = {};

const mmt = moment();

const newSign = (timeStamp, route, key) => {
  return shasum.update(timeStamp + route + key).digest('hex');
};

const setKey = (key) => (timeStamp, route) => {
  header['X-DL-SIGN'] = newSign(timeStamp, route, data.key);
  header['X-DL-TOKEN'] = data.token;
  header['X-DL-TS'] = timeStamp;

  return header;
};

let newHeader = setKey('');

const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config)
}

function login(conf) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      baseURL: API_URL,
      url: '/api/account/login',
      params: {
        pseudo: conf.pseudo,
        password: conf.password
      }
    })
    .then((res) => {
      const resData = res.data;
      if (resData.ERR && resData.ERR === 'maxAttempts') {
        reject('can\'t debrid now, max attemp rich');
      }

      data['token'] = res.data.value.token;
      data['key'] = res.data.value.key;

      newHeader = setKey(data.key);
      resolve('login success');
    })
    .catch(handleError);
  });
};

function infoAccount() {
  const route = '/api/account/infos';

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      baseURL: API_URL,
      url: route,
      header: newHeader(mmt.unix(), route)
    })
      .then((res) => {
        console.log(res.data);
        console.log(res.headers);
        console.log(res.config);
        resolve();
      })
      .catch(handleError);
  });
}

module.exports = {
  login,
  infoAccount,
}