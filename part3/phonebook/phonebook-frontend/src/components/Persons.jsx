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

export default Persons