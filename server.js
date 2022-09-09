const express = require('express');
const fs = require('fs');
const {writeFile, readFile} = fs.promises
const {v4: uuidv4} = require('uuid')
const PORT = 3001;
const path = require('path')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', async (req, res) => {
try {
    const readDb = await readFile('db/db.json')
    const db = JSON.parse(readDb)
    res.json(db)
} catch (error) {
    res.status(500).json(error.message)
}
})

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
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
