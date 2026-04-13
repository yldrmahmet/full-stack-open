import { useState } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)

  }

  const handlePersonClick = (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()
    if (!trimmedName || !trimmedNumber) {
      alert("blank name or blank number")
      return
    }
    // don't add person with same name or same number
    const samePerson = persons.find((person) => person.name === trimmedName || person.number === trimmedNumber)
    if (samePerson) {
      alert(`${samePerson.name} ${samePerson.number} is already added to phonebook`)
      return
    }
    // add new person
    setPersons([...persons, { name: trimmedName, number: trimmedNumber, id: persons.length + 1 }])
  }

  // search input logic for filtering
  const contacts = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter))
    : persons

  return (
    <div>
      <h2>phonebook</h2>
      <Filter onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={handlePersonClick} onNameChange={handleNameChange} onNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons contacts={contacts} />
    </div>
  )
}

export default App