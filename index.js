const express = require('express')
const app = express()
let contacts = require('./contacts')
const generateRandomId = require('./utils')
var path = require('path')
var fs = require('fs')
const morgan = require('morgan')
const PORT = 3001

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body', { stream: accessLogStream }))

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = contacts.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(person => person.id !== id)
    res.status(204).end()
})

app.use(express.json())
app.post('/api/persons', (req, res) => {
    const person = req.body
    if(!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    const duplicates = contacts.filter(contact => contact.name === person.name || contact.number)
    if(duplicates.length > 0) {
        return res.status(400).json({
            error: 'name and number must be unique'
        })
    }
    const newPerson = {
        id: generateRandomId(5),
        name: person.name,
        number: person.number
    }
    contacts = contacts.concat(newPerson)
    res.json(newPerson)
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

app.get('/info', (req, res) => {
    const date = Date().toString()
    res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
