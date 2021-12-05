import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import {
  getCountryCodes,
  getCountryFlags,
  getWeathers,
  getCityLatLng,
} from "./services/index";
import weatherImg from "./asset/clear-sky.png";

function App() {
  const [countryCodes, setCountryCodes] = useState([]);
  const [weathers, setWeathers] = useState([]);
  const [city, setCity] = useState("");
  const [activCountryCode, setActivCountryCode] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterCode, setFilterCode] = useState("");
  const [averageWeather, setAverageWeather] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    async function fetchMyAPI() {
      const codes = await getCountryCodes();
      const flags = await getCountryFlags();

      setCountryCodes(
        codes.data.map((code) => {
          const country = flags.data.find((flag) => flag.name === code.name);
          return {
            ...code,
            flag: country ? country.flag : "",
          };
        })
      );
    }

    fetchMyAPI();
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    setCity(event.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    getCityLatLng(city).then((res) => {
      getWeathers(res.lat, res.lon).then((res) => {
        setAverageWeather(
          Math.round(
            res.daily.slice(0, 7).reduce((a, b) => a + b.temp.day - 273.15, 0) /
              7
          )
        );
        setMonth(moment(res.current.dt * 1000).format("MMMM"));
        setYear(moment(res.current.dt * 1000).format("YYYY"));
        setWeathers(
          res.daily.slice(0, 7).map((day) => {
            return {
              ...day,
              day: moment(day.dt * 1000).format("dddd"),
              currentDay: Number(moment(day.dt * 1000).format("DD")),
              temperature: Math.round(day.temp.day - 273.15),
            };
          })
        );
      });
    });
  };

  const handleCountryCode = (country) => {
    setActivCountryCode(country);
    setShowDropdown(false);
  };
  const filterCountryCode = (e) => {
    setFilterCode(e.target.value.toUpperCase());
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const setLinearGradient = () => {
    if (averageWeather > 30) {
      return "linear-gradient(135deg, rgba(255,175,76,1) 80%, rgba(255,119,0,1) 100%)";
    } else if (averageWeather <= 30 && averageWeather > 15) {
      return "linear-gradient(135deg, rgba(255,246,114,1) 65%, rgba(255,175,76,1) 80%, rgba(255,119,0,1) 100%)";
    } else if (averageWeather <= 15 && averageWeather > 0) {
      return "linear-gradient(135deg, rgba(138,239,255,1) 50%, rgba(255,246,114,1) 65%, rgba(255,175,76,1) 80%, rgba(255,119,0,1) 100%)";
    } else if (averageWeather <= 0 && averageWeather > -15) {
      return "linear-gradient(135deg, rgba(78,185,255,1) 20%, rgba(138,239,255,1) 50%, rgba(255,246,114,1) 80%)";
    } else if (averageWeather <= -15 && averageWeather > -30) {
      return "linear-gradient(135deg, rgba(20,80,134,1) 0%, rgba(23,132,185,1) 20%, rgba(78,185,255,1) 35%)";
    } else {
      return "linear-gradient(135deg, rgba(20,80,134,1) 0%, rgba(23,132,185,1) 20%)";
    }
  };
  return (
    <div className="app">
      <div
        style={{
          background: averageWeather
            ? setLinearGradient()
            : "linear-gradient(135deg, rgba(129,220,255,1) 0%, rgba(255,189,97,1) 100%)",
          width: "100%",
          height: "100vh",
          position: "absolute",
        }}
      ></div>

      <form>
        <div className="pseudo-search">
          <img className="image" src={weatherImg} alt="" />

          <div style={{ position: "relative" }}>
            {activCountryCode && (
              <div className="flag-wrapper-active">
                <img className="flags" src={activCountryCode.flag} alt="" />
                <p>{activCountryCode.Iso2}</p>
              </div>
            )}
            <div className="first-item-wrapper">
              <input
                onChange={filterCountryCode}
                className={
                  activCountryCode ? "first-item-hidden" : "first-item"
                }
                type="text"
                autoFocus
                required
              />
              <FontAwesomeIcon
                onClick={handleShowDropdown}
                className="icon"
                icon={faAngleDown}
              />
            </div>
            {showDropdown && (
              <div className="options">
                {countryCodes
                  .filter((code) =>
                    code.Iso2 ? code.Iso2.includes(filterCode) : null
                  )
                  .map((code) => (
                    <div
                      onClick={() => handleCountryCode(code)}
                      className="flag-wrapper"
                    >
                      <img className="flags" src={code.flag} alt="" />
                      <p>{code.Iso2}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Please enter your location..."
            autoFocus
            required
          />
          <button onClick={handleClick} type="submit">
            <FontAwesomeIcon className="icon" icon={faSearch} />
          </button>
        </div>
        <div className="weathers-container">
          {weathers.length > 0 && (
            <div className="current-weather">
              <h2>
                {month} {weathers[0]?.currentDay} - {weathers[6]?.currentDay}{" "}
                {year}
              </h2>
              <h1>
                {averageWeather}
                <span>&#8451;</span>
              </h1>
            </div>
          )}
          <div className="next-weather">
            {weathers.map((weather) => (
              <div className="weather">
                <h2>{weather.day.toUpperCase()}</h2>
                <h3>
                  {weather.temperature}
                  <span>&#8451;</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
