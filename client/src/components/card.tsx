import React from 'react';

interface CardProps {
  card: {
    id: string;
    name: string;
    images: {
      small: string;
      large: string;
    };
  };
}

const Card: React.FC<CardProps> = ({ card }) => {
  if (!card || !card.name || !card.images?.small) {
    return null; // O muestra un placeholder si prefieres
  }

  return (
    <div className="card" style={{
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <img 
        src={card.images.small} 
        alt={`Carta de ${card.name}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
      <div style={{ padding: '0.5rem', textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>
          {card.name}
        </h3>
      </div>
    </div>
  );
};

export default React.memo(Card);