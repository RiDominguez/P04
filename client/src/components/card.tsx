import React from 'react';

interface CardProps {
  name: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ name, imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
    </div>
  );
};

export default Card;