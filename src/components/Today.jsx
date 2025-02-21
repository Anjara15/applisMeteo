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

const Today = ({ data, weatherUnits }) => {
    if (!data || !weatherUnits) {
        console.error("Invalid data or weatherUnits:", { data, weatherUnits });
        return <div>Erreur: Invalid data or weatherUnits</div>;
    }

    const weatherEmoji = getWeatherEmoji(data.temperature_2m_max, data.precipitation_sum, data.wind_speed_10m_max);
    const dayOfWeek = getDayOfWeek(data.day);

    return (
        <div className="today">
            <h2>Today's Weather</h2>
            <div className="weather-info">
                <div className="day">
                    {dayOfWeek}
                </div>
                <div className="temperature">
                    {data.temperature_2m_max} {weatherUnits.temperature}
                </div>
                <div className="description">
                    {data.description}
                </div>
                <div className="wind">
                    Wind: {data.wind_speed_10m_max} {weatherUnits.wind}
                </div>
                <div className="emojis">
                    {weatherEmoji && <div>{weatherEmoji}</div>}
                </div>
            </div>
        </div>
    );
};

Today.propTypes = {
    data: PropTypes.shape({
        day: PropTypes.string.isRequired,
        temperature_2m_max: PropTypes.number.isRequired,
        description: PropTypes.string,
        wind_speed_10m_max: PropTypes.number.isRequired,
        precipitation_sum: PropTypes.number.isRequired,
    }).isRequired,
    weatherUnits: PropTypes.shape({
        temperature: PropTypes.string.isRequired,
        wind: PropTypes.string.isRequired,
    }).isRequired,
};

export default Today;