import { useState, useEffect } from 'react'
import pbServices from './services/phonebook'
import Notification from './components/Notification'

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

const Search = ({ search, setSearch }) => (
  <div>
    Search: <input placeholder='Search by name' value={search} onChange={e => setSearch(e.target.value)} />
  </div>
)

const Persons = ({ persons, deletePerson }) => (
  <>
    {persons.map(person =>
      <div key={person.id} className='personList'>
        <p> {person.name} | {person.number} </p>
        <button onClick={() => deletePerson(person.id)}>Delete</button>
      </div>
    )}
  </>
)

const App = () => {
  const [persons, setPersons] = useState(null)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState({
    text: null,
    type: null
  });

  useEffect(() => {
    pbServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Failed to load phonebook:', error.message)
        alert('Could not load phonebook from the server.')
      })
  }, [])

  if (persons === null) {
    return <div>Loading phonebook...</div>
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id) //find the note with the given id in the persons array
    if (window.confirm(`Delete ${person.name} from phonebook?`)) {

      pbServices
        .deleteP(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id)) //deletes the person on local array
          setNotification({ text: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ text: null, type: null })
          }, 5000)
        })
        .catch(error => {
          console.error('Failed to delete:', error.message)
          setNotification({ text: `Could not delete ${person.name} from the server.`, type: 'error' })
          setTimeout(() => {
            setNotification({ text: null, type: null })
          }, 5000)
        })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification.text} type={notification.type} />
      <Search search={search} setSearch={setSearch} />

      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setNotification={setNotification} />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App