import _ from 'lodash';
import cities from 'cities.json';
import nations from 'countries-list';
import DOMController from './DomStuff';
import weatherConditionGifs from './data';
import ApiFetcher from './api-fetching';
import './css/main.scss';
import '@fortawesome/fontawesome-free';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Humidity from './css/humidity.png';
import Pressure from './css/pressure.png';

library.add(faSearch);
dom.watch();

const giphyExpression = async (data) => {
  const source = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  console.log(`https://api.giphy.com/v1/gifs/${weatherConditionGifs[`${data.weather[0].main}-${data.weather[0].icon[2]}`]}?api_key=FnaO3rXcDZNixxotdnLqLtYDrJYztxa1`)
  fetch(`https://api.giphy.com/v1/gifs/${weatherConditionGifs[`${data.weather[0].main}-${data.weather[0].icon[2]}`]}?api_key=FnaO3rXcDZNixxotdnLqLtYDrJYztxa1`)
    .then((response) => response.json())
    .then((response) => {
      const giphy = response.data.images.original.url;
      const weatherData = [
        {
          unity: '°F',
          value: Math.round((data.main.temp - 273.15) * (5 / 9) + 32),
          className: 'temperature'
        },
        {
          unity: '%',
          value: data.main.humidity,
          className: 'humidity'
        },
        {
          unity: 'hPa',
          value: data.main.pressure,
          className: 'pressure'
        },
      ];
      const measurePics = [source, Humidity, Pressure];
      const cityCard = {
        name: data.name,
        country: data.sys.country,
      }
      DOMController().setWeatherLooks(measurePics, giphy, weatherData, cityCard);
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