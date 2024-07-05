const express = require('express')
const app = express()
const contacts = require('./contacts')
const PORT = 3001

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = contacts.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

app.get('/info', (req, res) => {
    const date = Date().toString()
    res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`)
})
