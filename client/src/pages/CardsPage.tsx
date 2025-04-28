import React, { useState } from 'react';
import useCards from '../hooks/UseCards';
import CardList from '../components/CardList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import FilterBar from '../components/filterBar';
import Navbar from '../components/Navbar';

const CardsPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const { cards, loading, error, totalPages } = useCards(page, pageSize, {
    search,
    type: typeFilter,
    rarity: rarityFilter,
  });

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1); // Reset page on new search
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
            All Pokémon Cards
          </h1>
          <div className="w-full md:w-auto">
            <SearchBar search={search} setSearch={handleSearch} />
          </div>
        </div>

        {/* FilterBar nueva */}
        <FilterBar
          typeFilter={typeFilter}
          rarityFilter={rarityFilter}
          setTypeFilter={(value) => { setTypeFilter(value); setPage(1); }}
          setRarityFilter={(value) => { setRarityFilter(value); setPage(1); }}
        />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12 text-gray-500 text-lg">
            Loading cards...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12 text-red-600 text-lg">
            Error: {error}
          </div>
        )}

        {/* Card list */}
        {!loading && !error && (
          <div className="mt-8">
            <CardList cards={cards} />
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CardsPage;
