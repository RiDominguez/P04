import { useState, useCallback } from "react";
import React from 'react';
import useCards from "../../hooks/UseCards";
import Card from "../Card";
import Pagination from "../Pagination";
import SearchBar from "../SearchBar";

const Home = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { cards, loading, error, totalPages } = useCards(page, pageSize, search);

  // Resetear a página 1 cuando se realiza una nueva búsqueda
  const handleSearch = useCallback((searchTerm: string) => {
    setPage(1); // Resetear a primera página al buscar
    // Aquí puedes añadir lógica adicional si necesitas
    console.log('Buscando:', searchTerm);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Cartas de Pokémon TCG</h1>

      <div style={{ marginBottom: '2rem' }}>
      <SearchBar 
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        delay={400}
        placeholder="Buscar por nombre de Pokémon..."
      />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando cartas...</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '1rem' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No se encontraron cartas que coincidan con tu búsqueda.</p>
        </div>
      )}

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "1.5rem",
          marginBottom: '2rem'
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </div>
  );
};

export default Home;
