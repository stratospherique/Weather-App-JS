import fetch from 'node-fetch';

const ApiFetcher = (() => {
  const weatherCondition = async (city) => {
    const apiKey = '612ba83bcef55aa96b88795e503e2ec8';
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`, {
        mode: 'cors',
      })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  };
  return {
    weatherCondition,
  }
})();

export {
  ApiFetcher as
  default,
};