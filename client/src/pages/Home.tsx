import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <Hero />
      {/* Puedes agregar <Features />, <Footer />, etc. */}
    </div>
  );
};

export default Home;



