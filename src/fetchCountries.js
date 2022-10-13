const BASE_URL = 'https://restcountries.com/v3.1/name/';
const PARAM_FILTER = '?fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}${PARAM_FILTER}`).then(response => {
    // console.log(response);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
