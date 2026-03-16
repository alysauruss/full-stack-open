import Weather from './Weather'

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

            <Weather capital={country.capital} />
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

export default Main