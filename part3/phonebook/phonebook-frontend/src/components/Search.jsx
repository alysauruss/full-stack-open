const Search = ({ search, setSearch }) => (
    <div>
        Search: <input placeholder='Search by name' value={search} onChange={e => setSearch(e.target.value)} />
    </div>
)

export default Search