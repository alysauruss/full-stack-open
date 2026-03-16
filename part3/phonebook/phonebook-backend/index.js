const express = require('express')
const app = express()
const morgan = require('morgan')

let phonebook = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    },
    {
        id: "5",
        name: "Testing Delete",
        number: "39-23-129"
    }
]

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/phonebook', (request, response) => {
    response.json(phonebook)
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(p => Number(p.id)))
        : 0
    return String(maxId + 1)
}

app.post('/api/phonebook', (request, response) => {
    // console.log(request.headers) 
    // console.log(request.body) 

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {

    const num = phonebook.length
    const date = new Date()
    response.send(`
        <div>
            <p>Phonebook has info for ${num} people </p>
            <p>${date}</p>
        </div>
        `)
})

// const PORT = 3001
const PORT = process.env.PORT || 3001 //for hosting?
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})