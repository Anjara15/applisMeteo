import { useState, useEffect, useCallback } from "react";
import Today from "./components/Today";
import WeekDay from "./components/WeekDay";
import "./App.css";

// Villes principales de Madagascar pour suggestions rapides
const VILLES_MG = [
  { nom: "Antananarivo", lat: -18.8792, lon: 47.5079 },
  { nom: "Toamasina", lat: -18.1492, lon: 49.4023 },
  { nom: "Antsirabe", lat: -19.8659, lon: 47.0333 },
  { nom: "Mahajanga", lat: -15.7167, lon: 46.3167 },
  { nom: "Fianarantsoa", lat: -21.4536, lon: 47.0854 },
  { nom: "Toliara", lat: -23.3500, lon: 43.6667 },
  { nom: "Antsiranana", lat: -12.2787, lon: 49.2917 },
  { nom: "Nosy Be", lat: -13.3167, lon: 48.2667 },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [ville, setVille] = useState(VILLES_MG[0]);
  const [recherche, setRecherche] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherUnits, setWeatherUnits] = useState({});

  // Gestion du thème
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Recherche villes Madagascar uniquement
  useEffect(() => {
    if (recherche.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            recherche
          )}&count=8&language=fr&countryCode=MG`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [recherche]);

  // Récupération météo
  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${ville.lat}&longitude=${ville.lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
        `weather_code,wind_speed_10m,surface_pressure,precipitation,is_day` +
        `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,` +
        `precipitation_probability,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
        `sunrise,sunset,precipitation_sum,uv_index_max,wind_speed_10m_max` +
        `&timezone=Indian/Antananarivo&forecast_days=7`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.current) {
        setError(true);
      } else {
        setWeatherData(data);
        setWeatherUnits({
          temperature: data.current_units.temperature_2m,
          wind: data.current_units.wind_speed_10m,
          humidity: "%",
          pressure: "hPa",
          rain: "mm",
        });
      }
    } catch (e) {
      console.error("Erreur météo :", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [ville]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // 10 min
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // Géolocalisation
  const utiliserMaPosition = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non disponible sur ce navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVille({
          nom: "Ma position",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => alert("Impossible d'obtenir votre position.")
    );
  };

  const choisirVille = (v) => {
    setVille({
      nom: v.name || v.nom,
      lat: v.latitude || v.lat,
      lon: v.longitude || v.lon,
    });
    setRecherche("");
    setSuggestions([]);
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🌤️</div>
          <h1>MétéoMada</h1>
        </div>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une ville à Madagascar..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => choisirVille(s)}>
                  <span>{s.name}</span>
                  <small>{s.admin1 || "Madagascar"}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="icon-btn" onClick={utiliserMaPosition} title="Ma position">
          📍
        </button>
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Changer de thème"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      {/* RACCOURCIS VILLES */}
      <div className="villes-rapides">
        {VILLES_MG.map((v) => (
          <button
            key={v.nom}
            className={`ville-chip ${ville.nom === v.nom ? "actif" : ""}`}
            onClick={() => setVille(v)}
          >
            {v.nom}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <main className="container">
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Chargement des prévisions…</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <span>⚠️</span>
            <p>Une erreur est survenue lors de la récupération des données météo.</p>
            <button onClick={fetchWeather}>Réessayer</button>
          </div>
        )}

        {!isLoading && !error && weatherData && (
          <>
            <Today
              data={weatherData}
              ville={ville}
              weatherUnits={weatherUnits}
            />

            <section className="section">
              <h2>Prévisions sur 7 jours</h2>
              <div className="week-container">
                {weatherData.daily.time.map((jour, i) => (
                  <WeekDay
                    key={jour}
                    index={i}
                    data={{
                      jour,
                      tempMax: weatherData.daily.temperature_2m_max[i],
                      tempMin: weatherData.daily.temperature_2m_min[i],
                      precipitation: weatherData.daily.precipitation_sum[i],
                      vent: weatherData.daily.wind_speed_10m_max[i],
                      code: weatherData.daily.weather_code[i],
                    }}
                    weatherUnits={weatherUnits}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      
    </div>
  );
}

export default App;
