require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");

const requestLogger = (request, response, next) => {
  console.log("Method", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);
  console.log("---");
  next();
};

// middlewares

// 1. fetch frontend files
app.use(express.static("dist"));

// 2. Content-type = application/json => JSON.parse()
app.use(express.json());

// 3. log
app.use(requestLogger);

// endpoints

// api homepage
app.get("/", (request, response) => {
  response.send("<h1>hello world!</h1>");
});

// get all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// get one note
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else response.status(404).end();
    })
    .catch((error) => next(error));
});

// delete one note
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

// create one note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => response.json(savedNote));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findById(request.params.id).then((note) => {
    if (!note) {
      response.status(404).end();
    }

    note.content = content;
    note.important = important;

    return note
      .save()
      .then((updatedNote) => response.json(updatedNote))
      .catch((error) => next(error));
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
