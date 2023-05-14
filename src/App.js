import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import ViewMorePage from "./Pages/ViewMorePage";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/weather-page/:slug" element={<ViewMorePage />} />
      </Routes>
    </>
  );
}

export default App;
