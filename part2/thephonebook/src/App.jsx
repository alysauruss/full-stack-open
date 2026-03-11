import { useState } from 'react'
import './App.css'

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const validate = persons.some((item) => {
      return newName.trim().toLowerCase() === item.name.toLowerCase()
    })

    if (validate) {
      alert(`${newName} is already added to phonebook`);
      setNewName('')
    }
    else if (!newName) {
      alert('You must add a name!');
    }
    else if (!newNumber) {
      alert('You must add a number!');
    }
    else {
      const personObj = {
        name: newName.trim(),
        number: newNumber.trim(),
      }
      setPersons(persons.concat(personObj)) //add the new note on to array
      setNewName('') //set value of the form to ''
      setNewNumber('')
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

const Persons = ({ persons }) => (
  <div>
    {persons.map(person =>
      <p key={person.name}> {person.name} | {person.number} </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [search, setSearch] = useState('')
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Search search={search} setSearch={setSearch} />

      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App