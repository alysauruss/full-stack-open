import { useState, useEffect } from 'react'
import pbServices from '../services/phonebook'

const PersonForm = ({ persons, setPersons, setNotification }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()

        const person = persons.find((item) => {
            return newName.trim().toLowerCase() === item.name.toLowerCase()
        })

        if (!newName) {
            alert('You must add a name!');
        }
        else if (!newNumber) {
            alert('You must add a number!');
        }
        else if (person != undefined) {
            if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
                const id = person.id
                const changedNumber = { ...person, number: newNumber.trim() }
                const personName = person.name
                pbServices
                    .update(id, changedNumber)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id === id ? returnedPerson : person))
                        setNotification({ text: `Updated ${returnedPerson.name}'s number!`, type: 'success' })
                        setTimeout(() => {
                            setNotification({ text: null, type: null })
                        }, 5000)
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        console.error('Failed to update phonebook:', error.message)
                        setNotification({ text: `Information of ${personName} has already been removed from server`, type: 'error' })
                        setTimeout(() => {
                            setNotification({ text: null, type: null })
                        }, 5000)
                    })
            }
        }

        else {
            const personObj = {
                name: newName.trim(),
                number: newNumber.trim(),
            }

            pbServices
                .create(personObj)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))//add the new person on to the db server
                    setNotification({ text: `Added ${returnedPerson.name}`, type: 'success' })
                    setTimeout(() => {
                        setNotification({ text: null, type: null })
                    }, 5000)

                    setNewName('') //set value of the form to ''
                    setNewNumber('')
                })
                .catch(error => {
                    console.error('Failed to add to phonebook:', error.message)
                    setNotification({ text: `Failed to add ${returnedPerson.name} to phonebook. Please try again.`, type: 'error' })
                    setTimeout(() => {
                        setNotification({ text: null, type: null })
                    }, 5000)
                })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>Name: <input value={newName} onChange={e => setNewName(e.target.value)} /></div>
            <div>Number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} /></div>
            <div>
                <button type="submit">ADD</button>
            </div>
        </form>
    )
}

export default PersonForm