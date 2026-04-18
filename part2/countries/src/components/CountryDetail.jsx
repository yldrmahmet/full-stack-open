const CountryDetail = ({ displayCountry, countryWeather }) => {
  return (
    <div>
      <h1>{displayCountry.name.common}</h1>
      <p>Capital {displayCountry.capital[0]}</p>
      <p>Area {displayCountry.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(displayCountry.languages).map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>{" "}
      <br />
      <img src={displayCountry.flags.png} alt="flag" />
      <h2>{`Weather in ${displayCountry.capital[0]}`}</h2>
      <p>{`Temperature ${countryWeather?.main.temp} Celsius`}</p>
      <img
        src={`https://openweathermap.org/img/wn/${countryWeather?.weather[0]?.icon}@2x.png`}
        alt="weather"
      />
      <p>{`Wind ${countryWeather?.wind.speed} m/s`}</p>
    </div>
  );
};

export default CountryDetail;
