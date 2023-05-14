import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import Card from "../Component/Card";
import { TiStarOutline } from "react-icons/ti";
import Note from "../Component/Note";
import { useParams } from "react-router-dom";

const ViewMorePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState(
    JSON.parse(localStorage.getItem("favoriteCities")) || []
  );

  useEffect(() => {
    const cachedData = localStorage.getItem("weatherData");
    if (cachedData) {
      setWeatherData(JSON.parse(cachedData));
    }
  }, []);

  const { slug } = useParams();

  const toggleFavorite = () => {
    const city = matchingData?.city;
    if (!city) return;

    if (favoriteCities.length >= 15) {
      alert("You have already selected the maximum of 15 favorites.");
      return;
    }

    const index = favoriteCities.indexOf(city);
    if (index === -1) {
      // Add the city to the list of favorite cities
      setFavoriteCities([...favoriteCities, city]);
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify([...favoriteCities, city])
      );
    } else {
      // Remove the city from the list of favorite cities
      const updatedList = [...favoriteCities];
      updatedList.splice(index, 1);
      setFavoriteCities(updatedList);
      localStorage.setItem("favoriteCities", JSON.stringify(updatedList));
      localStorage.removeItem("favorite-" + city);
    }
  };

  const matchingData = weatherData?.find((e) => e?.city === slug);

  return (
    <>
      <Header showSearchInput={true} showDiv={true} showTab={true} />
      <div className="max-w-[90%] mx-auto grid grid-cols-1 sm:gap-1 md:grid-cols-12 gap-4">
        <div className="col-span-5">
          <Card
            className="h-64 relative"
            backgroundImage="/assets/weather-logo.avif"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
            <h1 className="absolute top-0 left-0 p-4 text-white text-3xl font-bold">
              {matchingData?.city}
            </h1>
          </Card>

          <Card className="bg-[#15242d]">
            <h1 className="text-xl font-bold text-[] flex items-center gap-3">
              Mark as favourite
              <TiStarOutline
                size={25}
                className={
                  matchingData && favoriteCities?.includes(matchingData?.city)
                    ? "text-yellow-500 cursor-pointer"
                    : "cursor-pointer"
                }
                onClick={toggleFavorite}
              />
            </h1>
            <div className="mt-4">
              <p className="text-lg text-[#15242d] font-meduim">
                Weather: {matchingData?.weatherDescription}
              </p>
              <p className="text-lg text-[#15242d] font-meduim">
                Coordinate:{" "}
                {matchingData?.latitude + ", " + matchingData?.longitude}
              </p>
              <p className="text-lg text-[#15242d] font-meduim">
                Wind Speed: {matchingData?.windSpeed}
              </p>
              <p className="text-lg text-[#15242d] font-meduim">
                Humidity: {matchingData?.humidity}
              </p>
              <p className="text-lg text-[#15242d] font-meduim">
                Temperature: {matchingData?.temperature}
              </p>
            </div>
          </Card>
        </div>
        <div className="col-span-7">
          <Note />
        </div>
      </div>
    </>
  );
};

export default ViewMorePage;
