const notesRouter = require('express').Router()
const Note = require('../models/note')

// all endpoints in one file.
// get all, get one, delete, create, update.

// get all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  return response.json(notes)
})

// get one note
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else response.status(404).end()
})

// delete one note
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// create one note
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

// update one note
notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  const note = await Note.findById(request.params.id)

  if (!note) {
    return response.status(404).end()
  }
  note.content = content
  note.important = important

  const updatedNote = await note.save()
  response.json(updatedNote)
})

module.exports = notesRouter
