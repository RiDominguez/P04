import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import './App.css';

const App: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [search, setSearch] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true); 

  const limit = 10; 

  useEffect(() => {
    fetch(`/api/pokemon/cards?page=${currentPage}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos:', data);
        setCards(data.cards || []);
        setTotalPages(data.totalPages); 
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las cartas:', error);
        setLoading(false);
      });
  }, [currentPage]);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Pokémon Cards</h1>
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
      <div className="card-container">
        {loading ? (
          <p>Loading...</p>
        ) : filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card key={card.id} name={card.name} imageUrl={card.images.small} />
          ))
        ) : (
          <p>No hay cartas que coincidan con la búsqueda.</p>
        )}
      </div>
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
