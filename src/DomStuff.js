const DOMController = () => {
  const backgroundImg = document.querySelector('.container');
  const display = document.querySelector('.weather');
  const selectList = document.querySelector('#cities-list');
  const selectList2 = document.querySelector('#countries-list');
  const cityInputDiv = document.querySelector('.two');
  const [countriesInput, citiesInput] = document.querySelectorAll('input');
  const searchBtn = document.querySelector('.started');
  const infoPanel = document.querySelector('.info');
  const cityName = document.querySelector('.city_name');
  const conversionPanel = document.querySelector('.conversion');
  const conversionSlider = document.querySelector('.slider');
  const conversionCheckbox = document.querySelector('#system');
  const temperature = () => document.querySelector('.temperature');

  const tempToggler = () => {
    conversionSlider.classList.toggle('right');
    conversionCheckbox.checked = !conversionCheckbox.checked;
    if (temperature()) {
      let temp = parseFloat(temperature().innerText.match(/\d+/)[0]);
      if (conversionCheckbox.checked) {
        temp = Math.round(((temp * 9) / 5) + 32);
        temperature().innerText = `${temp} °F`;
      } else {
        temp = Math.round((temp - 32) * (5 / 9));
        temperature().innerText = `${temp} °C`;
      }
    }
  };

  const fetchingError = (err, image) => {
    cityName.innerText = `Unavailable City info`;
    infoPanel.innerHTML = '';
    display.classList.remove('show-weather');
    setTimeout(() => {
      display.classList.add('show-weather');
    }, 1000);
    conversionPanel.classList.add('hide');
    backgroundImg.style['background-image'] = `url(${image})`;
  };

  const setWeatherLooks = (url, giphy, info, card) => {
    const displayDiv = url.map((link, ind) => {
      let skyImage = `<img src="${link}" />`;
      let theData = `<span class="${info[ind].className}">${info[ind].value}${info[ind].unity}</span>`;
      return `<div class="list">${skyImage}${theData}</div>`;
    }).join('');
    cityName.innerText = `${card.name}, ${card.country}`;
    infoPanel.innerHTML = displayDiv;
    display.classList.remove('show-weather');
    setTimeout(() => {
      display.classList.add('show-weather');
    }, 1000);
    conversionPanel.classList.remove('hide');
    conversionSlider.classList.add('right');
    conversionCheckbox.checked = true;
    backgroundImg.style['background-image'] = `url(${giphy})`;
  };

  const handleCountryInput = async (nations) => {
    if (countriesInput.value === '') {
      selectList2.classList.remove('show');
      citiesInput.setAttribute('disabled', true);
      citiesInput.removeAttribute('data-search');
      citiesInput.value = '';
      return;
    }
    const regex = new RegExp(`^(${countriesInput.value})`, 'i');
    const promise = Promise.resolve(nations.filter((item) => item[1].match(regex)));
    const nationsHtml = await promise
      .then((data) => {
        nations = data;
        return data
          .map((item) => `<li name="city" data-code="${item[0]}">${item[1]}</li>`)
          .join('');
      })
      .catch((err) => console.error(err));
    selectList2.innerHTML = await nationsHtml;
    selectList2.classList.value = 'show';
    selectList2.querySelectorAll('li').forEach((li) => {
      li.addEventListener('mousedown', () => {
        countriesInput.value = li.innerText;
        countriesInput.dataset.code = li.dataset.code;
        selectList2.classList.remove('show');
        citiesInput.removeAttribute('disabled');
        setTimeout(() => {
          cityInputDiv.classList.add('show-input');
        }, 1000)
      });
    });
  };

  const handleCityInput = async (cities) => {
    selectList2.classList.remove('show');
    if (citiesInput.value === '') {
      selectList.classList.remove('show');
      return;
    }

    const regex = new RegExp(`^(${citiesInput.value})`, 'i');
    const promise = Promise.resolve(cities.filter((item) => item[0].match(regex)));

    const citiesHtml = await promise
      .then((data) => {
        const temp = data.map((city) => `<li data-search="${[city[0].replace(/\s/g, '%20'), city[1].toLowerCase()].join(',')}">${city[0]}</li>`)
          .join('');
        return temp;
      })
      .catch((err) => console.error(err));
    selectList.innerHTML = await citiesHtml;
    selectList.classList.value = 'show';
    selectList.querySelectorAll('li').forEach((li) => {
      li.addEventListener('mousedown', () => {
        citiesInput.value = li.innerText;
        citiesInput.dataset.search = li.dataset.search;
        selectList.classList.remove('show');
      });
    });
  };

  const setPage = async (cities, countries, getWeather) => {
    const citiesCodes = [...new Set(cities.map((e) => e[1]))];
    const nations = citiesCodes.map((item) => [item, countries.countries[item].name]);
    let listOfCities = [];
    countriesInput.value = '';
    countriesInput.addEventListener('change', () => {
      listOfCities = cities.filter((city) => city[1] === countriesInput.dataset.code);
    });
    countriesInput.addEventListener('input', () => handleCountryInput(nations));
    citiesInput.addEventListener('input', () => handleCityInput(listOfCities));
    searchBtn.addEventListener('mousedown', () => handleSearchBtnClick(getWeather))
    conversionCheckbox.checked = false;
    conversionPanel.addEventListener('mousedown', tempToggler);
  };

  const handleSearchBtnClick = (getWeather) => {
    if (!citiesInput.dataset.search) {
      alert('Please enter city info');
      return;
    }
    getWeather(citiesInput.dataset.search);
    citiesInput.removeAttribute('data-search');
    citiesInput.value = '';
    citiesInput.setAttribute('disabled', true);
    countriesInput.removeAttribute('data-code');
    countriesInput.value = '';
    cityInputDiv.classList.remove('show-input');
  }


  return {
    setWeatherLooks,
    setPage,
    fetchingError,
  };
};

export {
  DOMController as
    default,
};