import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { prewiewMarkup, countryInfoMurkup } from './markup';

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
const NOTIFY_TIMEOUT = 2000; //ms

refs.inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

let inputValue = '';

function onSearch(event) {
  clearCountryHTML();
  inputValue = event.target.value.trim().toLowerCase();
  // console.log(inputValue);

  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      if (data.length === 1) {
        renderCountryInfoMarkup(data);
      } else if (data.length >= 2 && data.length <= 10) {
        renderPrewiewMarkup(data);
      } else {
        onManyCoincidences();
      }
    })
    .catch(error => {
      onResponseError();
    });
}

function renderPrewiewMarkup(data) {
  const markup = data.map(prewiewMarkup).join('');
  refs.countryListRef.innerHTML = markup;
}

function renderCountryInfoMarkup(data) {
  const markup = data.map(countryInfoMurkup).join('');
  refs.countryInfoRef.innerHTML = markup;
}

function clearCountryHTML() {
  refs.countryListRef.innerHTML = '';
  refs.countryInfoRef.innerHTML = '';
}

function onManyCoincidences() {
  return Notify.info(
    'Too many matches found. Please enter a more specific name.',
    {
      timeout: NOTIFY_TIMEOUT,
    }
  );
}

function onResponseError() {
  return Notify.failure('Oops, there is no country with that name', {
    timeout: NOTIFY_TIMEOUT,
  });
}

// function onResponseError(error) {
//   if (error.message === '404') {
//     Notify.failure(`Oops, there is no country with that name`, {
//       timeout: NOTIFY_TIMEOUT,
//     });
//     return;
//   }
//   Notify.failure(`Response error: ${error}`, {
//     timeout: NOTIFY_TIMEOUT,
//   });
// }
