import React, { useState } from 'react';
import { IoMdSunny, IoMdSnow, IoMdCloudy, IoMdRainy, IoMdThunderstorm, IoMdSearch } from 'react-icons/io';
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsWind } from 'react-icons/bs';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

const weatherIcons = {
  Clear: <IoMdSunny />,
  Snow: <IoMdSnow />,
  Clouds: <IoMdCloudy />,
  Rain: <IoMdRainy />,
  Thunderstorm: <IoMdThunderstorm />,
  Drizzle: <BsCloudDrizzleFill />,
  Mist: <BsCloudHaze2Fill />,
  Haze: <BsCloudHaze2Fill />,
};

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=afdf6294638636e13237f86643141c15&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);

      // Fetching weekly forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=afdf6294638636e13237f86643141c15&units=metric`
      );
      const forecastData = await forecastResponse.json();
      setWeeklyForecast(forecastData.list.filter((item) => item.dt_txt.includes('12:00:00')));

      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setWeather(null);
      setWeeklyForecast([]);
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="app">
      <h1>Weather Forecast</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">
          <IoMdSearch />
        </button>
      </form>

      {loading && <ImSpinner8 className="loading-spinner" />}

      {error && <p className="error-message">{error}</p>}

      {weather && !error && (
        <div className="weather-details">
          <h2>{weather.name}</h2>
          <div className="icon">{weatherIcons[weather.weather[0].main]}</div>
          <div className="details">
            <h3>
             {weather.weather[0].description}
            </h3>
            <p>
              Visibility: {weather.visibility / 1000} km <BsEye />
            </p>
            <p>
              Humidity: {weather.main.humidity}% <BsWater />
            </p>
            <p>
              Wind: {weather.wind.speed} m/s <BsWind />
            </p>
            <p>
              Temperature: {weather.main.temp}  <TbTemperatureCelsius />
            </p>
          </div>
        </div>
      )}

{weeklyForecast.length > 0 && (
        <div className="weekly-forecast">
          <h2>Weekly Forecast</h2>
          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={3} 
            slidesToScroll={1}
            swipeToSlide={true}
            focusOnSelect={true}
          >
            {weeklyForecast.map((item) => (
              <div key={item.dt} className="forecast-item">
                <p>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <div className="icon">{weatherIcons[item.weather[0].main]}</div>
                <p>{item.main.temp} °C</p>
              </div>
            ))}
          </Slider>
          </div>
      )}
    </div>
  );
};

export default App;
