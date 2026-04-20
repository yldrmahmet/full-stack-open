const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

// fetch frontend files
app.use(express.static("dist"));

// log middleware
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// data
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// get general info
app.get("/info", (request, response) => {
  response.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>
    `);
});

// get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// get one person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "not found";
    response.status(404).end();
  }
});

// delete one person
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "the name or number is missing" });
  }

  const existingPerson = persons.find((p) => p.name === body.name);
  if (existingPerson) {
    return response
      .status(400)
      .json({ error: "the name already exists in the phonebook" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, person];
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
