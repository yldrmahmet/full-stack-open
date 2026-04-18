const Filter = ({onChange, value}) => {
    return (
        <form>
        <label htmlFor="searchCountries">find countries</label>{" "}
        <input
          type="text"
          id="searchCountries"
          onChange={onChange}
          value={value}
        />
      </form>
    )
}

export default Filter