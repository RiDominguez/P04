import React from 'react';
import { useState } from 'react';
import useCards from '../hooks/UseCards';
import CardList from '../components/cardList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar'; // Asegúrate de tener este componente
// import Footer from '../Footer'; // Opcional

const CardsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const { cards, loading, error, totalPages } = useCards(page, pageSize, search);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1); // Reiniciar página al hacer búsqueda
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Título + Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Todas las cartas</h1>
          <SearchBar search={search} setSearch={handleSearch} />
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-12 text-gray-500">
            Cargando cartas...
          </div>
        )}

        {/* Errores */}
        {error && (
          <div className="text-center py-12 text-red-600">
            Error: {error}
          </div>
        )}

        {/* Grilla de cartas */}
        {!loading && !error && <CardList cards={cards} />}

        {/* Paginación */}
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default CardsPage;
