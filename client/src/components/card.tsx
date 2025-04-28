import React from 'react';

type CardProps = {
  card: {
    id: string;
    name: string;
    number: string;
    price?: number;
    images: {
      small: string;
      large: string;
    };
  };
};

const Card = ({ card }: CardProps) => {
  if (!card || !card.name || !card.images?.small) return null;

  return (
    <div className="bg-white rounded shadow border border-gray-200 w-full hover:shadow-lg transition duration-300">
      <img
        src={card.images.small}
        alt={`Carta de ${card.name}`}
        className="w-full object-cover rounded-t"
      />
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-900">{card.name}</h3>
        <p className="text-xs text-gray-500">{card.number}/159</p>


        {/* Controles de cantidad */}
        <div className="flex justify-center items-center gap-2 mt-2 text-sm text-gray-600">
          <button className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200">−</button>
          <span>0</span>
          <button className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200">+</button>
        </div>

      </div>
    </div>
  );
};

export default Card;

