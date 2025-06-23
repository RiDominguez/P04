import React from "react";

const features = [
  {
    title: "Track your collection progress",
    description:
      "Visualize your progress and what you’re missing. Sort by expansion, rarity, or card type.",
    img: "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2018/08/snorlax-1.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
  },
  {
    title: "Specify all the details you want",
    description:
      "Add details like condition, language, edition, or exact location of your cards.",
    img: "https://www.teameevee.com/wp-content/uploads/2022/04/pokemon-dormidos-y-relajados.jpg.webp",
  },
  {
    title: "Share your collection with anyone",
    description:
      "Generate links to easily share your collection with friends or potential trades.",
    img: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/02/Pokemon-Fire-Starters-Featured-Image.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
  },
];

const Hero = () => {
  return (
    <>
      {/* Hero principal con fondo oscuro */}
      <section className="bg-slate-900 text-white">
        <div className="min-h-[55vh] flex items-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between w-full py-20">
            {/* Texto principal */}
            <div className="text-center lg:text-left lg:w-1/2 space-y-8">
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-md">
                Organize your Pokémon collection
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 tracking-wide">
                Keep full control of your cards, find expansions, and explore your
                Pokédex simply and effectively.
              </p>
              <div className="flex justify-center lg:justify-start mt-8">
                <button className="bg-orange-500 hover:bg-orange-600 shadow-lg text-white px-8 py-4 rounded-lg font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400">
                  Get Started
                </button>
              </div>
            </div>

            {/* Imagen decorativa */}
            <div className="lg:w-1/2 mb-16 lg:mb-0 flex justify-center">
              <img
                src="https://images.pexels.com/photos/9661252/pexels-photo-9661252.jpeg"
                alt="Pokémon cards"
                className="w-full max-w-md rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
        
      </section>

      {/* Features con fondo blanco */}
      <section className="bg-white text-slate-900 py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-28">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={feature.title}
                className={`flex flex-col lg:flex-row items-center gap-14 ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Imagen */}
                <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Texto */}
                <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                  <h3 className="text-4xl font-bold text-slate-900 drop-shadow-sm">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed tracking-wide">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Hero;



