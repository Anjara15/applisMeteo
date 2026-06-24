import PropTypes from "prop-types";

const WMO_FR = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌦️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "❄️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const getJour = (iso, index) => {
  if (index === 0) return "Aujourd'hui";
  if (index === 1) return "Demain";
  const date = new Date(iso);
  return `${JOURS_FR[date.getUTCDay()]} ${date.getUTCDate()}`;
};

function WeekDay({ data, weatherUnits, index }) {
  if (!data) return null;

  const icone = WMO_FR[data.code] || "🌡️";
  const jour = getJour(data.jour, index);

  return (
    <div className="card week-day">
      <p className="week-jour">{jour}</p>
      <div className="week-icone">{icone}</div>
      <div className="week-temps">
        <span className="temp-max">{Math.round(data.tempMax)}°</span>
        <span className="temp-min">{Math.round(data.tempMin)}°</span>
      </div>
      <div className="week-details">
        <span>💧 {data.precipitation.toFixed(1)}{weatherUnits.rain}</span>
        <span>🌬️ {Math.round(data.vent)}{weatherUnits.wind}</span>
      </div>
    </div>
  );
}

WeekDay.propTypes = {
  data: PropTypes.shape({
    jour: PropTypes.string.isRequired,
    tempMax: PropTypes.number.isRequired,
    tempMin: PropTypes.number.isRequired,
    precipitation: PropTypes.number.isRequired,
    vent: PropTypes.number.isRequired,
    code: PropTypes.number.isRequired,
  }).isRequired,
  weatherUnits: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default WeekDay;
