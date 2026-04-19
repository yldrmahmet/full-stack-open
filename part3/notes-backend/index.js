const express = require("express");
const app = express();

// middleware
// Content-type = application/json => JSON.parse()
app.use(express.json());

// data
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// api homepage
app.get("/", (request, response) => {
  response.send("<h1>hello world!</h1>");
});

// get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// get one note
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "not found";
    response.status(404).end();
  }
});

// delete one note
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// create id for new note
const generateId = () => {
  // choose biggest id
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

// create one note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  };

  notes = notes.concat(note);

  response.json(notes);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
