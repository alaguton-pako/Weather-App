import axios from "axios";
import { getWeatherData } from "../Services/services";

jest.mock("axios");

describe("getWeatherData", () => {
  it("returns the expected weather data for a given city", async () => {
    const city = "New York";
    const mockData = {
      name: "New York",
      main: {
        temp: 20,
        pressure: 1000,
      },
      coord: { lat: 40.7128, lon: -74.006 },
      weather: [{ description: "cloudy" }],
      wind: { speed: 10 },
    };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getWeatherData(city);

    expect(result.city).toEqual("New York");
    expect(result.temperature).toEqual("20°C");
    expect(result.pressure).toEqual("1000 hPa");
  });

  it("throws an error if the city is not found", async () => {
    const city = "Nonexistent City";
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(getWeatherData(city)).rejects.toThrow("City not found");
  });

  it("throws an error for other API errors", async () => {
    const city = "New York";
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    await expect(getWeatherData(city)).rejects.toThrow("API Error");
  });
});