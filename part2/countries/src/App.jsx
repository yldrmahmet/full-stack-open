import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";
import countryService from "./services/countries";

const App = () => {
  const [input, setInput] = useState("");
  const [countries, setCountries] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryWeather, setCountryWeather] = useState(null);

  useEffect(() => {
    countryService.getAllCountries().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  const filteredCountries = input
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(input.toLowerCase()),
      )
    : [];

  const displayCountry =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
    if (displayCountry) {
      countryService
        .getWeather(displayCountry.latlng[0], displayCountry.latlng[1])
        .then((weatherData) => {
          setCountryWeather(weatherData);
        });
    }
  }, [displayCountry]);

  const handleInputChange = (event) => {
    setSelectedCountry(null);
    const value = event.target.value;
    setInput(value);
  };

  const handleShowCountryDetailClick = (country) => {
    console.log(country);
    setSelectedCountry(country);
  };

  if (!countries) return;

  return (
    <div>
      <Filter onChange={handleInputChange} value={input} />
      {displayCountry ? (
        <CountryDetail
          displayCountry={displayCountry}
          countryWeather={countryWeather}
        />
      ) : (
        <CountryList
          filteredCountries={filteredCountries}
          onClick={handleShowCountryDetailClick}
        />
      )}
    </div>
  );
};

export default App;
