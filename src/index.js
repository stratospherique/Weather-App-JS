import _ from 'lodash';
import './css/main.scss';

const getWeather = (cityID) => {
	const apiKey = '612ba83bcef55aa96b88795e503e2ec8';
	fetch('http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=612ba83bcef55aa96b88795e503e2ec8', {
			mode: 'cors'
		})
		.then((response) => {
			console.log(response.json());
		})
		.catch((err) => {
			console.log(err);
		});
};

window.onload = getWeather('London,uk');