import { useState, useEffect } from "react";
import noteService from "./services/notes";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("a new note");
  const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const hook = () => {
    noteService.getAll().then((initialNotes) => {
      console.log(initialNotes);
      setNotes(initialNotes);
    });
  };

  useEffect(hook, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      console.log(returnedNote);
      setNotes([...notes, returnedNote]);
      setNewNote("");
      setMessageType("success");
      setMessage(`Note ${returnedNote.content} added.`);
    });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleShowImportantClick = () => {
    setShowAll(!showAll);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
        setMessageType("success");
        setMessage(`Note "${note.content}" importance is changed.`);
      })
      .catch((_error) => {
        setMessageType("error");
        setMessage(`Note ${note.content} was already removed from server`);
        setTimeout(() => setMessage(null), 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  if (!notes) return null;

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} messageType={messageType} />
      <div>
        <button onClick={handleShowImportantClick}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
