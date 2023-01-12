import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './App.css';

const WEATHER_API = {
  key: "eba8c85c702bdb0a237cff400b2cec80",
  url: "https://api.openweathermap.org/data/2.5/"
}

const icon = (iconId: string) => {
  return `http://openweathermap.org/img/wn/${iconId}@4x.png`
}

interface Weather {
  cityName?: string,
  weatherIcon?: string,
  weatherName?: string,
  weatherDescription?: string,
  temperature?: string,
  temperatureMin?: string,
  temperatureMax?: string
  error?: string
}

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [weather, setWeather] = useState<Weather>();

  const search = () => {
    fetch(`${WEATHER_API.url}weather?q=${query}&units=metric&appid=${WEATHER_API.key}`)
      .then(res => res.json())
      .then((response) => {
        if (response.cod !== 200) {
          throw new Error(response.message);
        }
        let weatherModel = {
          cityName: response.name,
          weatherIcon: icon(response.weather[0].icon),
          weatherName: response.weather[0].main,
          weatherDescription: response.weather[0].description,
          temperature: `${Math.round(response.main.temp)}°C`,
          temperatureMin: `${Math.round(response.main.temp_min)}°C`,
          temperatureMax: `${Math.round(response.main.temp_max)}°C`,
          error: response.message
        };
        setWeather(weatherModel);
      }).catch(e => {
        setWeather({ error: e.message });
      });
  }

  return (
    <div className="container">
      <div className="search-box">
        <InputGroup className="mb-3"          >
          <Form.Control
            placeholder="Enter city name"
            onChange={e => setQuery(e.target.value)}
            value={query} />
          <Button variant="outline-secondary" id="btn-search" onClick={search}>Search</Button>
        </InputGroup>
      </div>
      {
        (typeof weather?.temperature != "undefined") ? (
          <div className="weather-box">
            <h1 className="cityName">{weather?.cityName}</h1>
            <img
              src={weather?.weatherIcon}
              alt={weather?.weatherName} />

            <h1 className="temperature">{weather?.temperature}</h1>
            <div className="temperatureMinMax">
              <span className="tempMin"> {weather?.temperatureMin}</span>
              <span className="tempMax"> {weather?.temperatureMax}</span>
            </div>
            <p className="weatherDescription">{weather?.weatherDescription}</p>
          </div>
        ) : (
          <h1 className="error">{weather?.error}</h1>
        )
      }
    </div >
  );
}

