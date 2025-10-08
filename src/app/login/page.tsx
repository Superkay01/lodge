import React from "react";
import Navbar from "@/components/landing/Navbar";
import Login from "@/components/Login"
import Footer from "@/components/landing/Footer";
const page = () => {
  return (
    <div>
      <Navbar />
      <Login/>
      <Footer/>
    </div>
  );
};

export default page;
