require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//get all
app.get('/api/phonebook', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        }).catch(error => next(error))
})

//info
app.get('/api/phonebook/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const now = new Date()
            const timeString = now.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
            response.send(`<p>There are ${count} people in the phonebook</p><p>Current time: ${timeString}</p>`)
        }).catch(error => next(error))
})

//get by id
app.get('/api/phonebook/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            //check if null
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        }).catch(error => next(error))
})

//add a new person
app.post('/api/phonebook', (request, response, next) => {
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        }).catch(error => next(error))
})

//delete by id
app.delete('/api/phonebook/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        }).catch(error => next(error))
})

//update number
app.put('/api/phonebook/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
            person.name = name
            person.number = number

            return person.save()
                .then(updatedPerson => {
                    response.json(updatedPerson)
                })
        }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})