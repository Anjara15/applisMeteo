import PropTypes from "prop-types";

// Codes WMO → description française + icône
const WMO_FR = {
  0: { label: "Ciel dégagé", icon: "☀️" },
  1: { label: "Plutôt dégagé", icon: "🌤️" },
  2: { label: "Partiellement nuageux", icon: "⛅" },
  3: { label: "Couvert", icon: "☁️" },
  45: { label: "Brouillard", icon: "🌫️" },
  48: { label: "Brouillard givrant", icon: "🌫️" },
  51: { label: "Bruine légère", icon: "🌦️" },
  53: { label: "Bruine modérée", icon: "🌦️" },
  55: { label: "Bruine dense", icon: "🌧️" },
  61: { label: "Pluie faible", icon: "🌦️" },
  63: { label: "Pluie modérée", icon: "🌧️" },
  65: { label: "Pluie forte", icon: "🌧️" },
  71: { label: "Neige faible", icon: "🌨️" },
  73: { label: "Neige modérée", icon: "❄️" },
  75: { label: "Neige forte", icon: "❄️" },
  80: { label: "Averses", icon: "🌦️" },
  81: { label: "Averses fortes", icon: "🌧️" },
  82: { label: "Averses violentes", icon: "⛈️" },
  95: { label: "Orage", icon: "⛈️" },
  96: { label: "Orage avec grêle", icon: "⛈️" },
  99: { label: "Orage violent", icon: "⛈️" },
};

const getWmo = (c) => WMO_FR[c] || { label: "—", icon: "🌡️" };

const Today = ({ data, ville, weatherUnits }) => {
  const c = data.current;
  const d = data.daily;
  const w = getWmo(c.weather_code);

  const heureLocale = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Indian/Antananarivo",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const formatHeure = (iso) =>
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Indian/Antananarivo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  // 24 prochaines heures
  const maintenant = new Date();
  const debut = data.hourly.time.findIndex((t) => new Date(t) >= maintenant);
  const i0 = Math.max(0, debut);
  const heures = data.hourly.time.slice(i0, i0 + 24).map((t, k) => ({
    heure: new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Indian/Antananarivo",
      hour: "2-digit",
    }).format(new Date(t)),
    temp: Math.round(data.hourly.temperature_2m[i0 + k]),
    code: data.hourly.weather_code[i0 + k],
    pluie: data.hourly.precipitation_probability[i0 + k] ?? 0,
  }));

  return (
    <section className="today-section">
      {/* Carte principale */}
      <div className="card today-hero">
        <div className="today-info">
          <div className="ville-info">
            <span className="pin">📍</span>
            <div>
              <h2>{ville.nom}</h2>
              <p className="pays">Madagascar</p>
              <p className="heure-locale">{heureLocale}</p>
            </div>
          </div>

          <div className="temp-bloc">
            <span className="temp-grande">{Math.round(c.temperature_2m)}</span>
            <span className="temp-unite">{weatherUnits.temperature}</span>
          </div>

          <p className="description">{w.label}</p>
          <p className="ressenti">
            Ressenti : <strong>{Math.round(c.apparent_temperature)}{weatherUnits.temperature}</strong>
          </p>
          <p className="minmax">
            ↑ {Math.round(d.temperature_2m_max[0])}°  ·  ↓ {Math.round(d.temperature_2m_min[0])}°
          </p>
        </div>

        <div className="today-icon">
          <div className="icon-meteo">{w.icon}</div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="card stat">
          <span className="stat-icon">💧</span>
          <span className="stat-label">Humidité</span>
          <span className="stat-value">{c.relative_humidity_2m}<small>%</small></span>
        </div>
        <div className="card stat">
          <span className="stat-icon">🌬️</span>
          <span className="stat-label">Vent</span>
          <span className="stat-value">{Math.round(c.wind_speed_10m)}<small>{weatherUnits.wind}</small></span>
        </div>
        <div className="card stat">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Pression</span>
          <span className="stat-value">{Math.round(c.surface_pressure)}<small>hPa</small></span>
        </div>
        <div className="card stat">
          <span className="stat-icon">☀️</span>
          <span className="stat-label">Indice UV</span>
          <span className="stat-value">{Math.round(d.uv_index_max[0] ?? 0)}</span>
        </div>
        <div className="card stat">
          <span className="stat-icon">🌧️</span>
          <span className="stat-label">Précipitations</span>
          <span className="stat-value">{c.precipitation.toFixed(1)}<small>mm</small></span>
        </div>
        <div className="card stat">
          <span className="stat-icon">🌅</span>
          <span className="stat-label">Lever / Coucher</span>
          <span className="stat-value sun">
            {formatHeure(d.sunrise[0])} · {formatHeure(d.sunset[0])}
          </span>
        </div>
      </div>

      {/* Prévisions horaires */}
      <div className="card">
        <h3>Prochaines 24 heures</h3>
        <div className="hourly">
          {heures.map((h, idx) => (
            <div key={idx} className="hour-item">
              <span className="hour-label">{h.heure}h</span>
              <span className="hour-icon">{getWmo(h.code).icon}</span>
              <span className="hour-temp">{h.temp}°</span>
              <span className="hour-rain">💧 {h.pluie}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Today.propTypes = {
  data: PropTypes.object.isRequired,
  ville: PropTypes.object.isRequired,
  weatherUnits: PropTypes.object.isRequired,
};

export default Today;
