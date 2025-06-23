import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <Hero />
      {/* footer */}
    </div>
  );
};

export default Home;



