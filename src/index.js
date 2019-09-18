import _ from 'lodash';
import './css/main.scss';
import cities from 'cities.json';
import nations from 'countries-list';
import DOMController from './DomStuff';
import weatherConditionGifs from './data';


const getWeather = (cityID) => {
  const apiKey = '612ba83bcef55aa96b88795e503e2ec8';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityID}&APPID=${apiKey}`, {
    mode: 'cors',
  }).then((response) => response.json())
    .then((data) => {
      const source = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      fetch(`https://api.giphy.com/v1/gifs/${weatherConditionGifs[`${data.weather[0].main}-${data.weather[0].icon[2]}`]}?api_key=FnaO3rXcDZNixxotdnLqLtYDrJYztxa1`)
        .then((response) => response.json())
        .then((response) => {
          const giphy = response.data.images.original.url;
          DOMController().setWeatherLooks(source, giphy, [data.name, data.main.temp]);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const preparePage = () => {
  const citiesCode = cities.map((item) => [item.name, item.country]);
  DOMController().setPage(citiesCode, nations, getWeather);
};

window.onload = preparePage();