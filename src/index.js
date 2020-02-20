import _ from 'lodash';
import cities from 'cities.json';
import nations from 'countries-list';
import DOMController from './DomStuff';
import weatherConditionGifs from './data';
import ApiFetcher from './api-fetching';
import './css/main.scss';


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
  await ApiFetcher.weatherCondition(cityID).then((data) => {
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