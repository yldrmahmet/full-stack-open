const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ahmet:${password}@cluster0.4idw3i8.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {
  family: 4,
  serverSelectionTimeoutMS: 30000,
  bufferTimeoutMS: 30000,
})

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// add new note

// const note = new Note({
//   content: "Javascript is powerful",
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// get notes from database

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
