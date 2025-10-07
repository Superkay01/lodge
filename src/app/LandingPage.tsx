import React from "react";
import Navbar from "../components/landing/Navbar";
import Home from "./Home/page"
import ListingSection from "@/components/landing/ListingSection";
import StatsCounter from "@/components/StatsCounter";
import FeatureTiles from "@/components/FeatureTiles";
import PartnersLogo from "@/components/PartnersLogo"
import CTASection from "@/components/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Home/>
      <ListingSection/>
      <FeatureTiles/>
      <StatsCounter/>
      <PartnersLogo/>
      <CTASection/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
