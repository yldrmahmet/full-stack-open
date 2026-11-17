const CountryDetail = ({ displayCountry, countryWeather }) => {
  return (
    <div>
      <h1>{displayCountry.name.common}</h1>
      {displayCountry.capital && <p>Capital {displayCountry.capital[0]}</p>}
      <p>Area {displayCountry.area}</p>
      {displayCountry.languages && (
        <>
          <h2>Languages</h2>
          <ul>
            {Object.values(displayCountry.languages).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      )}
      <img src={displayCountry.flags.png} alt="flag" />
      {countryWeather?.cca3 === displayCountry.cca3 && (
        <>
          {displayCountry.capital ? (
            <h2>{`Weather in ${displayCountry.capital[0]}`}</h2>
          ) : (
            <h2>{`Weather in ${displayCountry.name.common}`}</h2>
          )}
          <p>{`Temperature ${countryWeather.data.main.temp} Celsius`}</p>
          <img
            src={`https://openweathermap.org/img/wn/${countryWeather.data.weather[0]?.icon}@2x.png`}
            alt="weather"
          />
          <p>{`Wind ${countryWeather.data.wind.speed} m/s`}</p>
        </>
      )}
    </div>
  );
};

export default CountryDetail;
