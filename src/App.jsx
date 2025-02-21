import { useState, useEffect, useCallback } from "react";
import WeekDay from "./components/WeekDay";
import Today from "./components/Today";
import './App.css';

function App() {

  const formatWeatherDataDaily = useCallback((dailyData) => {
    // Format daily weather data
    console.log("Formatting daily data:", dailyData);
    const formattedData = dailyData.time.map((time, index) => ({
      day: time,
      temperature_2m_max: dailyData.temperature_2m_max[index],
      temperature_2m_min: dailyData.temperature_2m_min[index],
      precipitation_sum: dailyData.precipitation_sum[index],
      wind_speed_10m_max: dailyData.wind_speed_10m_max ? dailyData.wind_speed_10m_max[index] : 0, // Assuming wind_speed_10m_max is available
      // Removing humidity
    }));
    return formattedData;
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [geoloc, setGeoloc] = useState({ latitude: -20, longitude: 47 });
  const [weatherUnits, setWeatherUnits] = useState({ rain: "", temperature: "", wind: "" });
  const [weatherData, setWeatherData] = useState([])

  const fetchWeather = useCallback(async () => {
    setError(false);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${geoloc.latitude}&longitude=${geoloc.longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,showers_sum,snowfall_sum`; // Removing relative_humidity_2m
      const res = await fetch(url);
      const data = await res.json();
      console.log("Fetched data:", data);

      if (Object.keys(data).length === 0) {
        setError(true);
      } else {
        // formatted daily data
        const formattedDailyData = formatWeatherDataDaily(data.daily);
        setWeatherData(formattedDailyData);

        // unités
        setWeatherUnits({
          rain: data.daily_units.precipitation_sum,
          temperature: data.daily_units.temperature_2m_max,
          wind: data.daily_units.wind_speed_10m_max,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(true);
    }
  }, [formatWeatherDataDaily, geoloc]);

  const getGeolocalisation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoloc({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError(true);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      window.alert("navigateur n'autorise pas la géolocalisation!");
      setIsLoading(false);
    } else {
      getGeolocalisation();
    }
  }, []);

  useEffect(() => {
    if (geoloc.latitude !== 0 && geoloc.longitude !== 0) {
      fetchWeather().then(() => setIsLoading(false));
    }
  }, [geoloc, fetchWeather]);

  return (
    <div className="app">
      <div className="weather-container">
        {isLoading && <div className="loading">Chargement...</div>}
        {error && <div className="error">Une erreur est survenue lors de la récupération des prévisions du météo.</div>}
        {!isLoading && !error && weatherData.length > 0 && (
          <>
            <div className="today">
              <Today data={weatherData[0]} weatherUnits={weatherUnits}/>
            </div>
            <div className="week-container">
              {weatherData.slice(1).map((data, index) => (
                <WeekDay key={index} data={data} weatherUnits={weatherUnits}/>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;