import axios from "axios";

const API_KEY = "03cd65a547d05397550a10163acab7c5";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherData(city) {
  const response = await axios.get(API_BASE_URL, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
}

export async function getWeatherDataForCities(cities) {
  try {
    const weatherData = await Promise.all(cities.map(getWeatherData));
    const sortedWeatherData = weatherData.sort((a, b) => a.name.localeCompare(b.name));
    const formattedWeatherData = sortedWeatherData.map(({ name, main, coord, weather, wind }) => {
      return {
        city: name,
        temperature: `${main.temp}°C`,
        pressure: `${main.pressure} hPa`,
        humidity: `${main.humidity}%`,
        windSpeed: `${wind.speed} m/s`,
        windDirection: `${wind.deg}°`,
        weatherDescription: weather[0].description,
        weatherIcon: weather[0].icon,
        latitude: `${coord.lat}°`,
        longitude: `${coord.lon}°`,
      };
    });
    return formattedWeatherData;
  } catch (error) {
    console.error(error);
  }
}


