const CountryList = ({ filteredCountries, onClick }) => {
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  return (
    <ul>
      {filteredCountries.map((c) => (
        <li key={c.cca3}>
          {c.name.common}
          <button onClick={() => onClick(c)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
