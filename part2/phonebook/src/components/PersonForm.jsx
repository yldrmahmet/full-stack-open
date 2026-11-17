const PersonForm = ({ name, number, onSubmit, onNameChange, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <p>
        <label htmlFor="name">name: </label>
        <input id="name" value={name} onChange={onNameChange} />
      </p>
      <p>
        <label htmlFor="number">number: </label>
        <input id="number" value={number} onChange={onNumberChange} />
      </p>
      <button type="submit">add</button>
    </form>
  );
};

export default PersonForm;
