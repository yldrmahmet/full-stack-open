const CountryList = ({ filteredCountries, onClick }) => {
  return (
    <div>
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        filteredCountries.map((c) => (
          <li key={c.ccn3}>
            {c.name.common}
            <button onClick={() => onClick(c)}>Show</button>
          </li>
        ))
      )}
    </div>
  );
};

export default CountryList;
