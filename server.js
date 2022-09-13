// Dependencies
const express = require('express');
const fs = require('fs');
const {writeFile, readFile} = fs.promises
const {v4: uuidv4} = require('uuid')
const path = require('path')

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// Gets the route index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Gets the route notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Reads the db.json file and returns all saved notes as JSON
app.get('/api/notes', async (req, res) => {
try {
    const readDb = await readFile('db/db.json')
    const db = JSON.parse(readDb)
    res.json(db)
} catch (error) {
    res.status(500).json(error.message)
}
})

// Receives a new note to save and adds it to the db.json file. gives each note a unique id.
app.post('/api/notes', async (req, res) => {
try {
    const readDb = await readFile('db/db.json')
    const db = JSON.parse(readDb)
    req.body.id= uuidv4()
    db.push(req.body)
    await writeFile('db/db.json', JSON.stringify(db)) 
    res.json(db)
} catch (error) {
    res.status(500).json(error.message)
}
})

// Starts the server to begin listening
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
