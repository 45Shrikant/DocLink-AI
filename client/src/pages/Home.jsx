import React from "react";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import HomeCircles from "../components/HomeCircles";
import AiChat from "../components/AiChat";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutUs />
      <HomeCircles />
      <AiChat />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
