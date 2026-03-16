import { useState, useEffect } from 'react'
import axios from 'axios'

import Search from './components/Search'
import Main from './components/Main'

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountry(response.data);
      })
      .catch(error => {
        console.error('Failed to load rest countries', error.message)

      })
  }, [])

  if (!countries) {
    return <p>Getting countries list....</p>
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div>
        <Search search={search} setSearch={setSearch} />

        <Main filteredCountries={filteredCountries} search={search} setSearch={setSearch} />
      </div>
    </>
  )
}

export default App
