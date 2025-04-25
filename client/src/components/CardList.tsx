import Card from './card';
import React from 'react';

type CardData = {
  id: string;
  name: string;
  number: string;
  price?: number;
  images: {
    small: string;
    large: string;
  };
};

type CardListProps = {
  cards: CardData[];
};

const CardList = ({ cards }: CardListProps) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No se encontraron cartas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card) => (
        <Card card={card} />
      ))}
    </div>
  );
};

export default CardList;
