import _ from 'lodash';
import './css/main.scss';
import cities from 'cities.json';
import nations from 'countries-list';
import DOMController from './DomStuff';
import weatherConditionGifs from './data';


const weatherCondition = async (city) => {
  const apiKey = '612ba83bcef55aa96b88795e503e2ec8';
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`, {
    mode: 'cors',
  })
    .then((response) => response.json())
    .then((data) => Promise.resolve(data))
    .catch((err) => Promise.reject(err));
};

const giphyExpression = async (data) => {
  const source = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  fetch(`https://api.giphy.com/v1/gifs/${weatherConditionGifs[`${data.weather[0].main}-${data.weather[0].icon[2]}`]}?api_key=FnaO3rXcDZNixxotdnLqLtYDrJYztxa1`)
    .then((response) => response.json())
    .then((response) => {
      const giphy = response.data.images.original.url;
      DOMController().setWeatherLooks(source, giphy, [data.name, data.main.temp]);
    })
    .catch((err) => Promise.reject(err));
};

const getWeather = async (cityID) => {
  await weatherCondition(cityID).then((data) => {
    giphyExpression(data).catch((err) => {
      DOMController().fetchingError('Unavailabe city info &#128148');
    });
  }).catch((err) => {
    DOMController().fetchingError(err);
  });
};


const preparePage = () => {
  const citiesCode = cities.map((item) => [item.name, item.country]);
  DOMController().setPage(citiesCode, nations, getWeather);
};

window.onload = preparePage();