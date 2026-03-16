const Search = ({ search, setSearch }) => (
    <div>
        Find countries: <input value={search} onChange={e => setSearch(e.target.value)} />
    </div>
)

export default Search