import { useState } from 'react'
import './App.css'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const Statictics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const avg = (good - bad) / total
  const percen = (good / total) * 100

  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="Good: " value={good} endText=" " />
          <StatisticLine text="Neutral: " value={neutral} endText=" " />
          <StatisticLine text="Bad: " value={bad} endText=" " />
          <StatisticLine text="Total: " value={total} endText=" " />
          <StatisticLine text="Average: " value={avg} endText=" " />
          <StatisticLine text="Positive: " value={percen} endText=" %" />
        </tbody>
      </table>
    )
  }

}

const StatisticLine = ({ text, value, endText }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {endText}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text='good' />
      <Button onClick={handleNeutral} text='neutral' />
      <Button onClick={handleBad} text='bad' />
      <h1>Statistics</h1>
      <Statictics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
