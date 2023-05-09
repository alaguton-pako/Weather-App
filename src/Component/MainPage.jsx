import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import { getWeatherDataForCities } from "../Services/services";
import { cities } from "../Helper/Data";
import Spinner from "./Spinner";

export const MainPage = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData) {
        setWeatherData(JSON.parse(cachedData));
      } else {
        try {
          const data = await getWeatherDataForCities(cities);
          // console.log(data)
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
                  navigate("/weather-page");
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
