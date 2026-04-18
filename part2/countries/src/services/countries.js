import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = import.meta.env.VITE_API_KEY;

const getAllCountries = () => axios.get(`${baseUrl}/all`).then((r) => r.data);

const getWeather = (lat, lon) =>
  axios
    .get(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((r) => r.data);

export default { getAllCountries, getWeather };
