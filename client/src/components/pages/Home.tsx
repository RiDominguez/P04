import React, { useState, useEffect } from 'react';
import Card from '../Card';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';

const Home: React.FC = () => {
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
      <SearchBar search={search} setSearch={setSearch} />
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
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
};

export default Home;
