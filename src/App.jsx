import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import WeatherCard from './components/WeatherCard'
const APIkey='68947ab4a8007a59f0983cb21e2ebb3d'
function App() {
  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temp, setTemp] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [textImput, setTextImput] = useState('')
  const [finder, setFinder] = useState()
  const [hasError, setHasError] = useState(false)

  const success = position => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    setCoords(obj)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success)
  }, [])

  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}`
      axios.get(url).then(res => {
        const obj = {
          celsius: (res.data.main.temp - 273.15).toFixed(2),
          fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(2)
        }
        setTemp(obj)
        setHasError(false)
        setWeather(res.data)
      }).catch(err => {
        setHasError(true)
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [coords])

  useEffect(()=>{
    if(textImput){
      const url=`https://api.openweathermap.org/data/2.5/weather?q=${textImput}&appid=${APIkey}`
      axios.get(url).then(
        res=>{
          console.log(res)
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(2)
          }
          setTemp(obj)
          setHasError(false)
          setFinder(res.data)
        }
      ).catch(err=>{
        setHasError(true)
        console.log(err)
      })
    }
  },[textImput])

  return (
    <div className='app'>
      {
        isLoading?
        <h2>Loading...</h2>
        :
        textImput?
        <WeatherCard
          weather={finder}
          temp={temp}
          setTextInput={setTextImput}
          hasError={hasError}
        />
        :
        <WeatherCard
          weather={weather}
          temp={temp}
          setTextInput={setTextImput}
          hasError={hasError}
        />
      }
    </div>
  )
}

export default App
