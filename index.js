const express = require('express')
const app = express()
const contacts = require('./contacts')
const PORT = 3001

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

app.get('/info', (req, res) => {
    const date = Date().toString()
    res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`)
})
