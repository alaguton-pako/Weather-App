import React, { useEffect } from "react";
import Header from "../Component/Header";
import MainPage from "../Component/MainPage";


export const LandingPage = () => {
  

  // useEffect(() => {
  //   const hasVisited = localStorage.getItem("hasVisited");
  //   if (!hasVisited && "geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         // user granted permission, position contains their location
  //         // const lat = position.coords.latitude;
  //         // const lon = position.coords.longitude;
  //         // redirect to the weather page with the user's location
  //         // window.location.href = `/weather?lat=${lat}&lon=${lon}`;
  //         window.location.href = `/weather-page`;
  //       },
  //       (error) => {
  //         // user denied permission or an error occurred
  //         console.error(error);
  //       }
  //     );
  //     localStorage.setItem("hasVisited", true);
  //   }
  // }, []);

  return (
    <>
      <Header />
      <MainPage />
    </>
  );
};
