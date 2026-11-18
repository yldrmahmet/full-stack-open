const PersonForm = ({ name, number, onSubmit, onNameChange, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">name: </label>
        <input id="name" value={name} onChange={onNameChange} />
      </div>
      <div>
        <label htmlFor="number">number: </label>
        <input id="number" value={number} onChange={onNumberChange} />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default PersonForm;
