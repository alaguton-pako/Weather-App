import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { AiFillCloud } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import { getWeatherData } from "../Services/services";

function Header({ showSearchInput, showDiv, showTab, onSearch = () => {} }) {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState([]);
  const selectedCity = localStorage.getItem("selectedCity");
  const [favoriteCities, setFavoriteCities] = useState(
    JSON.parse(localStorage.getItem("favoriteCities"))
  );
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const existingData =
        JSON.parse(localStorage.getItem("weatherData")) || [];
      const cityExists = existingData.some(
        (item) => item.city.toLowerCase() === searchInput.toLowerCase()
      );
      if (!cityExists) {
        const data = await getWeatherData(searchInput);
        
        existingData.push(data);
        setWeatherData(existingData);
        localStorage.setItem("weatherData", JSON.stringify(existingData));
        localStorage.setItem("selectedCity", data.city  )
        
      }
      onSearch(searchInput);
    } catch (error) {
      console.log(error);
    }
  };


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };


  useEffect(() => {
    const storedWeatherData = localStorage.getItem("weatherData");
    if (storedWeatherData !== undefined) {
      console.log('tfd')
      setWeatherData(JSON.parse(storedWeatherData));
    } else {
      setWeatherData([])
    }
  }, []);

  const handleDeleteFavorite = (city) => {
    const newFavorites = favoriteCities.filter((favCity) => favCity !== city);
    setFavoriteCities(newFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(newFavorites));
  };

  const matchingData =
    weatherData && weatherData.find((data) => data.city === selectedCity);

  return (
    <header className="">
      <div className="py-2 px-9 flex justify-between gap-3 items-center bg-[#022d4f]">
        <div className="flex items-center gap-3">
          <div className="h-20 w-20">
            <img
              src="/assets/weather-logo.avif"
              alt="companyLogo"
              className="object-cover object-center h-full w-full cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <h1 className="font-base text-2xl text-white">
            An <span className="font-bold">Elite</span> Solution Application
          </h1>
        </div>
        <div className="w-1/5 ">
          {showSearchInput ? (
            <div className="rounded-full">
              <FiSearch
                size={25}
                className="text-black absolute top-9 right-16 z-20"
                onClick={handleSearch}
              />
              <input
                type="text"
                placeholder="Search City"
                className="p-2 pr-9 rounded-full w-full h-full relative"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="text-white h-10 w-full bg-[#3a5773] flex items-center gap-3 pl-9 text-lg">
        {showDiv ? (
          <>
            {matchingData?.weatherDescription === "rainy" ||
              (matchingData?.weatherDescription ===
                "heavy intensity shower rain" && (
                <BsFillCloudLightningRainFill />
              ))}

            {matchingData?.weatherDescription === "cloudy" ||
              (matchingData?.weatherDescription === "broken clouds" && (
                <AiFillCloud />
              ))}
            {matchingData?.weatherDescription === "sunny" ||
              (matchingData?.weatherDescription === "clear sky" && <MdSunny />)}
            <p>{matchingData?.temperature}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 overflow-x-scroll w-screen">
              <h1 className="text-white">Favourites:</h1>
              {favoriteCities && favoriteCities.length > 0 ? (
                favoriteCities.map((city) => (
                  <div
                    key={city}
                    className="flex-shrink-0 flex items-center gap-1"
                  >
                    {city}
                    <span>
                      <TiDelete
                        className="text-red-50 cursor-pointer hover:text-red-500"
                        onClick={() => handleDeleteFavorite(city)}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-white">No favourite cities added</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="bg-[#15242d] h-8 w-full">
        {showTab ? (
          <>
            <ul className="px-8 py-2 flex justify-around items-center text-white">
              <li className="text-white">City: {matchingData?.city}</li>
              <li className="text-white">Humidity: {matchingData?.humidity}</li>
              <li className="text-white">Pressure: {matchingData?.pressure}</li>
              <li className="text-white">latitude: {matchingData?.latitude}</li>
              <li className="text-white">
                longitude: {matchingData?.longitude}
              </li>

              <li className="text-white">
                wind Speed: {matchingData?.windSpeed}
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
