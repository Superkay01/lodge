import React from "react";
import Navbar from "./components/landing/Navbar";
import Home from "./Home/page"
import Footer from "./components/landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Home/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
