import { useState, useEffect } from 'react'
import pbServices from './services/phonebook'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Search from './components/Search'
import Persons from './components/Persons'

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