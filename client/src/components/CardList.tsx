import React, { useState } from 'react';
import Card from './Card'; 

interface CardData {
  id: string;
  name: string;
  number: string;
  price?: number;
  images: {
    small: string;
    large: string;
  };
}

interface CardListProps {
  cards: CardData[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No cards found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="cursor-pointer"
          >
            <Card card={card} />
          </div>
        ))}
      </div>
    </>
  );
};

export default CardList;
