import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ search, setSearch }) => (
  <div>
    Find countries: <input value={search} onChange={e => setSearch(e.target.value)} />
  </div>
)

const Main = ({ filteredCountries, search, setSearch }) => {
  console.log('Search rendered', filteredCountries.length, 'countries')
  if (!search) {
    return null
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  //Object values convert object values into an array
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    console.log('country 0: ', country)
    return <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>

      {Object.values(country.languages).map(language =>
        <ul key={language}>
          <li>{language}</li>
        </ul>
      )}
      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {country.capital}</h2>
    </div>
  }

  const showCountry = (country) => {
    setSearch(country)
  }

  //if countries length is around 2-10
  return (
    <>
      {filteredCountries.map(country =>
        <ul key={country.name.common}>
          <li>{country.name.common} <button onClick={() => showCountry(country.name.common)}>Show</button></li>
        </ul>
      )}
    </>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountry(response.data);
        console.log('countries: ', response.data);
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
