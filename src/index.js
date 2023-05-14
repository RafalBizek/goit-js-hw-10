import './css/styles.css';
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const createCountryList = countries => {
  countryList.innerHTML = '';
  countries.forEach(country => {
    const countryItem = document.createElement('li');
    countryItem.innerHTML = `<img src="${country.flag}" alt="${country.name}" width="90" height="70" /><span>${country.name}</span>`;
    countryItem.addEventListener('click', () => {
      createCountryInfo(country); // Dodaj przekazanie obiektu kraju do funkcji createCountryInfo
    });
    countryList.appendChild(countryItem);
  });
};

const createCountryInfo = country => {
  countryInfo.innerHTML = '';
  const countryFlag = document.createElement('img');
  countryFlag.setAttribute('src', country.flag); // Dodaj atrybut src i przypisz wartość flagi kraju
  countryFlag.setAttribute('alt', country.name);
  const countryName = document.createElement('h2');
  countryName.textContent = country.name;
  const countryCapital = document.createElement('p');
  countryCapital.textContent = `Capital: ${country.capital}`;
  const countryPopulation = document.createElement('p');
  countryPopulation.textContent = `Population: ${country.population}`;
  const countryLanguages = document.createElement('p');
  countryLanguages.textContent = `Languages: ${country.languages}`;
  countryInfo.append(
    countryFlag,
    countryName,
    countryCapital,
    countryPopulation,
    countryLanguages
  );
};

const debouncedSearchCountry = debounce(() => {
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchValue)
    .then(countries => {
      // console.log(countries);
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        createCountryList(countries);
      } else if (countries.length === 1) {
        countryList.innerHTML = '';
        createCountryInfo(countries[0]);
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Something went wrong.');
      console.error(error);
    });
}, DEBOUNCE_DELAY);

searchInput.addEventListener('input', debouncedSearchCountry);
