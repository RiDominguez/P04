import React, { useEffect, useState } from 'react';

function App() {
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    // Llamar al backend para obtener las cartas
    const fetchCards = async () => {
      const response = await fetch("http://localhost:8000/api/pokemon/cards");
      const data = await response.json();
      setCards(data.data); // Asegúrate de que el backend devuelva datos en `data.data`
    };

    fetchCards();
  }, []);

  return (
    <div>
      <h1>Cartas Pokémon</h1>
      <ul>
        {cards.map((card: any) => (
          <li key={card.id}>
            <h2>{card.name}</h2>
            <p>{card.set.name}</p>
            <img src={card.images.small} alt={card.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
