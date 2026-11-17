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
    const latLng = displayCountry?.capitalInfo.latlng
      ? displayCountry.capitalInfo?.latlng
      : displayCountry?.latlng;
    if (latLng) {
      countryService.getWeather(latLng[0], latLng[1]).then((weatherData) => {
        setCountryWeather({ cca3: displayCountry.cca3, data: weatherData });
      });
    }
  }, [displayCountry]);

  const handleInputChange = (event) => {
    setSelectedCountry(null);
    const value = event.target.value;
    setInput(value);
  };

  const handleShowCountryDetailClick = (country) => {
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
