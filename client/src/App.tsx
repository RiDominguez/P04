import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import './App.css';

const App: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [search, setSearch] = useState(''); // Estado para la búsqueda

  useEffect(() => {
    fetch('/api/pokemon/cards')
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos:', data);
        setCards(data.data || []);
      })
      .catch((error) => console.error('Error al obtener las cartas:', error));
  }, []);

  // Filtrar las cartas según el texto ingresado en la barra de búsqueda
  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Pokémon Cards</h1>
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar cartas"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      {/* Contenedor de cartas */}
      <div className="card-container">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card
              key={card.id}
              name={card.name}
              imageUrl={card.images.small}
            />
          ))
        ) : (
          <p>No hay cartas que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default App;