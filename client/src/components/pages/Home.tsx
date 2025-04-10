import React, { useState } from 'react';
import Card from '../Card';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
import { useCards } from '../../hooks/UseCards'; // Asegúrate de que la ruta sea correcta

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Usamos el hook personalizado para obtener las cartas filtradas y paginadas
  const { paginatedCards, loading, totalPages } = useCards(currentPage, limit, search);

  return (
    <div className="App">
      <h1>Pokémon Cards</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="card-container">
        {loading ? (
          <p>Loading...</p>
        ) : paginatedCards.length > 0 ? (
          paginatedCards.map((card) => (
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
