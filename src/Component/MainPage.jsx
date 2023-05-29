import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import {
  getWeatherDataForCities,
  getWeatherDataByUserLocation,
} from "../Services/Services";
import { cities } from "../Helper/Data";
import Spinner from "./Spinner";

export const MainPage = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [prompted, setPrompted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData) {
        setWeatherData(JSON.parse(cachedData));
      } else {
        try {
          const data = await getWeatherDataForCities(cities);

          localStorage.setItem("weatherData", JSON.stringify(data));
          setWeatherData(data);
        } catch (error) {
          console.error(error);
          setError(true);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function handleLocationAccess() {
      const isFirstVisit = localStorage.getItem("isFirstVisit");
      if (!isFirstVisit) {
        const hasAllowedAccess = localStorage.getItem("hasAllowedAccess");
        if (hasAllowedAccess) return;
        const permission = await window.navigator.permissions.query({
          name: "geolocation",
        });
        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const weatherData = await getWeatherDataByUserLocation(
                latitude,
                longitude
              );
              console.log(weatherData);
              const storedWeatherData =
                JSON.parse(localStorage.getItem("weatherData")) || [];
              const existingCity = storedWeatherData.find(
                (data) => data.city === weatherData.city
              );
              if (!existingCity) {
                storedWeatherData.push(weatherData);
                localStorage.setItem(
                  "weatherData",
                  JSON.stringify(storedWeatherData)
                );
              }
              localStorage.setItem("hasAllowedAccess", true);
              localStorage.setItem("isFirstVisit", "false");
            },
            (error) => {
              console.error(error);
              localStorage.setItem("isFirstVisit", "false");
            }
          );
        } else if (permission.state === "prompt") {
          const hasShownPrompt = localStorage.getItem("hasShownPrompt");
          if (hasShownPrompt) return;
          setPrompted(true);
          const confirmed = await new Promise((resolve) => {
            if (!hasShownPrompt) {
              localStorage.setItem("hasShownPrompt", true);
            }
            resolve(true);
          });
          if (confirmed) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                const weatherData = await getWeatherDataByUserLocation(
                  latitude,
                  longitude
                );
                console.log(weatherData);
                const storedWeatherData =
                  JSON.parse(localStorage.getItem("weatherData")) || [];
                const existingCity = storedWeatherData.find(
                  (data) => data.city === weatherData.city
                );
                if (!existingCity) {
                  storedWeatherData.push(weatherData);
                  localStorage.setItem(
                    "weatherData",
                    JSON.stringify(storedWeatherData)
                  );
                }
                navigate(`/weather-page/${weatherData?.city}`);

                localStorage.setItem("selectedCity", weatherData.city);
                localStorage.setItem("hasAllowedAccess", true);
                localStorage.setItem("isFirstVisit", "false");
              },
              (error) => {
                console.error(error);
                localStorage.setItem("isFirstVisit", "false");
              }
            );
          } else {
            localStorage.setItem("isFirstVisit", "false");
          }
        } else {
          localStorage.setItem("isFirstVisit", "false");
        }
      }
    }

    handleLocationAccess();
  }, []);

  const handleDelete = (city) => {
    const updatedData = weatherData.filter((data) => data.city !== city);
    localStorage.setItem("weatherData", JSON.stringify(updatedData));
    setWeatherData(updatedData);
  };

  return (
    <Card className="max-w-[80%] mx-auto">
      <h1 className="font-bold text-2xl text-[#022d4f] py-4">
        Most Popular Searches
      </h1>
      <div className="">
        {error ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-red-500">
              An error occurred. Please try again later.
            </p>
          </div>
        ) : weatherData ? (
          weatherData.map(({ city, temperature }) => (
            <div
              className="flex justify-between items-center mb-3 hover:bg-white p-2 rounded-lg cursor-pointer"
              key={city}
            >
              <div
                className="font-medium"
                onClick={() => {
                  localStorage.setItem("selectedCity", city);
                  navigate(`/weather-page/${city}`);
                }}
              >{`${city}. Current temperature => ${temperature}`}</div>
              <div className="flex items-center">
                <span className="">
                  <TiDelete
                    size={25}
                    className="hover:text-red-400 cursor-pointer"
                    onClick={() => handleDelete(city)}
                  />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-80">
            <Spinner />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MainPage;
