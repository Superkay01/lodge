import React from "react";
import Navbar from "../components/landing/Navbar";
import Home from "./Home/page"
import ListingSection from "@/components/landing/ListingSection";
import StatsCounter from "@/components/StatsCounter";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Home/>
      <ListingSection/>
      <StatsCounter/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
