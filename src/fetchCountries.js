const baseUrl = 'https://restcountries.com/v3.1/';

export const fetchCountries = name => {
  const fields = 'fields=name.official,capital,population,flags.svg,languages';
  const url = `${baseUrl}name/${encodeURIComponent(name)}?${fields}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        return []; // Zwraca pustą tablicę w przypadku braku wyników
      }

      const countries = data.map(country => {
        const commonName =
          country.name && country.name.official
            ? country.name.official
            : 'unknown';
        const flag =
          country.flags && country.flags.svg ? country.flags.svg : 'unknown';
        return {
          name: commonName,
          flag: flag,
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
