const DOMController = () => {
  const backgroundImg = document.querySelector('.container');
  const display = document.querySelector('.weather');
  const selectList = document.querySelector('#cities-list');
  const selectList2 = document.querySelector('#countries-list');
  const [countriesInput, citiesInput] = document.querySelectorAll('input');
  const searchBtn = document.querySelector('.started');
  const infoPanel = document.querySelector('.info');
  const conversionPanel = document.querySelector('.conversion');
  const conversionSlider = document.querySelector('.slider');
  const conversionCheckbox = document.querySelector('#system');
  const temperature = () => document.querySelector('.temp');

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
    } else {
      console.error('no temp');
    }
  };

  const setWeatherLooks = (url, giphy, info) => {
    const skyImage = new Image();
    skyImage.src = url;
    if (document.querySelector('img')) {
      display.removeChild(document.querySelector('img'));
    }
    display.insertBefore(skyImage, document.querySelector('.info'));
    backgroundImg.style['background-image'] = `url(${giphy})`;
    let temp = parseFloat(info[1]);
    if (conversionCheckbox.checked) {
      temp = Math.round((temp - 273.15) * (5 / 9) + 32);
      info[1] = `<span class="temp">${temp} °F</span>`;
      infoPanel.innerHTML = `${info.join(', ')}`;
    } else {
      temp = Math.round(temp - 273.15);
      info[1] = `<span class="temp">${temp} °C</span>`;
      infoPanel.innerHTML = `${info.join(', ')}`;
    }
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
      });
    });

    if (nations.length === 1) {
      citiesInput.removeAttribute('disabled');
    } else {
      citiesInput.setAttribute('disabled', true);
    }
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
    countriesInput.addEventListener('change', () => {
      listOfCities = cities.filter((city) => city[1] === countriesInput.dataset.code);
    });
    countriesInput.addEventListener('input', () => handleCountryInput(nations));
    countriesInput.addEventListener('change', () => handleCountryInput(nations));
    citiesInput.addEventListener('input', () => handleCityInput(listOfCities));
    citiesInput.addEventListener('change', () => handleCityInput(listOfCities));
    searchBtn.addEventListener('click', () => {
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
    });
    conversionCheckbox.checked = false;
    conversionPanel.addEventListener('mousedown', tempToggler);
  };


  return {
    setWeatherLooks,
    setPage,
  };
};

export {
  DOMController as
  default,
};