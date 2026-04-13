const PersonForm = ({ onSubmit, onNameChange, onNumberChange }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input onChange={onNameChange} />
            </div>
            <div>
                number: <input onChange={onNumberChange} />
            </div>
            <button type="submit">add</button>
        </form>
    )
}

export default PersonForm