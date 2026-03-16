import axios from "axios"
import { useState, useEffect } from "react"
const api_key = import.meta.env.VITE_WEATHER_KEY

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
            .then(response => {
                setWeather(response.data)
            })
    }, [capital])

    return (
        <>
            <h2>Weather in {capital}</h2>
            {weather && (
                <div>
                    <p>Temperature: {weather.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </>

    )
}

export default Weather