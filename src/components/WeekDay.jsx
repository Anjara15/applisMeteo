import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

function getWeatherEmoji(temperature, precipitation, windSpeed) {
  if (precipitation > 0) {
    if (precipitation > 10) {
      return "🌧️"; // Heavy rain
    }
    return "🌦️"; // Light rain
  } else if (windSpeed > 20) {
    return "🌬️"; // Windy
  } else if (temperature > 30) {
    return "☀️"; // Hot
  } else if (temperature < 0) {
    return "❄️"; // Snow
  } else {
    return "☁️"; // Cloudy
  }
}

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[date.getUTCDay()];
}

function WeekDay({ data, weatherUnits }) {
    const [weatherEmoji, setWeatherEmoji] = useState("");
    const [averageTemperature, setAverageTemperature] = useState(0);

    useEffect(() => {
        if (!data) return;

        const avTemp = ((data.temperature_2m_max + data.temperature_2m_min) / 2).toFixed(1);
        const emoji = getWeatherEmoji(Number(avTemp), data.precipitation_sum, data.wind_speed_10m_max);

        setAverageTemperature(avTemp);
        setWeatherEmoji(emoji);

    }, [data]);

    if (!data || !weatherUnits) {
        return <div>Erreur</div>;
    }

    const dayOfWeek = getDayOfWeek(data.day);

    return (
        <div>
            <p>{dayOfWeek}</p>
            <p>{averageTemperature} <span>{weatherUnits.temperature}</span></p>
            <div>
                {weatherEmoji && <div>{weatherEmoji}</div>}
            </div>
        </div>
    );
}

WeekDay.propTypes = {
    data: PropTypes.shape({
        day: PropTypes.string.isRequired,
        temperature_2m_max: PropTypes.number.isRequired,
        temperature_2m_min: PropTypes.number.isRequired,
        precipitation_sum: PropTypes.number.isRequired,
        wind_speed_10m_max: PropTypes.number.isRequired,
    }).isRequired,
    weatherUnits: PropTypes.shape({
        temperature: PropTypes.string.isRequired,
    }).isRequired,
};

export default WeekDay;