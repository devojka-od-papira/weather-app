import axios from "axios";

export const getCountryCodes = () => {
  return axios
    .get("https://countriesnow.space/api/v0.1/countries/iso")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

export const getCountryFlags = () => {
  return axios
    .get("https://countriesnow.space/api/v0.1/countries/flag/images")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

export const getWeathers = (lat, lon) => {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&unit=metric&appid=70e8fabc5e87570cbbe639bfed3912a7`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

export const getCityLatLng = (city) => {
  return axios
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=70e8fabc5e87570cbbe639bfed3912a7`
    )
    .then((res) => {
      return res.data[0];
    })
    .catch((error) => {
      console.log("error");
    });
};
