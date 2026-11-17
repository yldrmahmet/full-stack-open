const Filter = ({ onChange, value }) => {
  return (
    <div>
      <label htmlFor="searchCountries">find countries</label>{" "}
      <input
        type="text"
        id="searchCountries"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default Filter;
