import React from "react";

const Hero = () => {
    return (
      <section className="pt-24 pb-16 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Administra tu colección Pokémon con estilo
            </h2>
            <p className="text-gray-300">
              Organiza tu pokédex con facilidad.
            </p>
            <div className="flex space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">Crear cuenta</button>
              <button className="bg-white text-slate-900 hover:bg-gray-200 px-6 py-2 rounded">Buscar cartas</button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <img src="/your-image.svg" alt="" className="max-w-md w-full" />
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;
  