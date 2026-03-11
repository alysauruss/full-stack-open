const Header = ({ course }) => (
    <h3>{course}</h3>
)

const Part = ({ part, exercises }) => (
    <p>{part}: {exercises}</p>
)

const Content = ({ parts }) => (
    <div>
        {parts.map(item =>
            <Part key={item.id} part={item.name} exercises={item.exercises} />
        )}
    </div>
)

const Total = ({ parts }) => (
    <b>Total of {parts.reduce((sum, item) => sum + item.exercises, 0)} exercises</b>
)

const Course = ({ courses }) => (
    <>
        {courses.map(item =>
            <div key={item.id}>
                <Header course={item.name} />
                <Content parts={item.parts} />
                <Total parts={item.parts} />
            </div>
        )}
    </>

)

export default Course