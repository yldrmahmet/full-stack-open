import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    personService.getAll().then((returnedPerson) => setPersons(returnedPerson));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handlePersonClick = (event) => {
    event.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();
    if (!trimmedName || !trimmedNumber) {
      alert("blank name or blank number");
      return;
    }
    // don't add person with same name or same number
    const samePerson = persons.find(
      (person) =>
        person.name === trimmedName && person.number === trimmedNumber,
    );
    if (samePerson) {
      setMessageType("error");
      setMessage(
        `"${samePerson.name} ${samePerson.number}" is already added to phonebook`,
      );
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const personWithSameName = persons.find(
      (person) => person.name === trimmedName,
    );

    // add new person
    const newObject = { name: trimmedName, number: trimmedNumber };

    // don't add person with same name and different number, update
    if (personWithSameName) {
      if (
        window.confirm(
          `${personWithSameName.name} is already added, replace the old number?`,
        )
      ) {
        personService
          .updateNumber(personWithSameName.id, newObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id === personWithSameName.id ? returnedPerson : p,
              ),
            );
            setMessageType("success");
            setMessage(
              `Number of "${personWithSameName.name}" is changed to ${returnedPerson.number} from ${personWithSameName.number}`,
            );
            setTimeout(() => setMessage(null), 5000);
          })
          .catch((error) => {
            setMessageType("error");
            setMessage(
              `this person "${personWithSameName.name}" already been removed from server`,
            );
            setPersons(persons.filter((p) => personWithSameName.id !== p.id));
          });
      }
      return;
    }

    personService.create(newObject).then((returnedPerson) => {
      setPersons([...persons, returnedPerson]);
      setMessageType("success");
      setMessage(
        `added new person name: "${returnedPerson.name}" number: "${returnedPerson.number}"`,
      );
    });
  };

  const handleDeleteClick = (id) => {
    const deletingPerson = persons.find((p) => p.id === id);

    if (window.confirm("Delete?")) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
        setMessageType("success");
        setMessage(`deleted "${deletingPerson.name}" `);
        setTimeout(() => setMessage(null), 5000);
      });
    }
  };

  // search input logic for filtering
  const contacts = filter
    ? persons.filter(
        (person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()) ||
          person.number.includes(filter),
      )
    : persons;

  return (
    <div>
      <h2>phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={handlePersonClick}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons contacts={contacts} onClick={handleDeleteClick} />
    </div>
  );
};

export default App;
