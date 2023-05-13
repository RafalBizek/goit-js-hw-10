const baseUrl = 'https://restcountries.com/v3.1/';

export const fetchCountries = name => {
  const fields = 'fields=name.official,capital,population,flags.svg,languages';
  const url = `${baseUrl}name/${name}?${fields}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      const countries = data.map(country => {
        return {
          name: country.name.common,
          flag: country.flags.svg,
          capital: country.capital?.[0] || 'unknown',
          population: country.population || 'unknown',
          languages: Object.values(country.languages).join(', ') || 'unknown',
        };
      });
      return countries;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};
