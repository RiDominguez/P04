import { useState, useEffect, useMemo } from 'react';

interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
}

interface Filters {
  search?: string;
  type?: string;
  rarity?: string;
}

const useCards = (page: number, pageSize: number, filters: Filters = {}) => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // useMemo para "congelar" los filtros
  const stableFilters = useMemo(() => ({
    search: filters.search,
    type: filters.type,
    rarity: filters.rarity,
  }), [filters.search, filters.type, filters.rarity]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', String(page));
        queryParams.append('pageSize', String(pageSize));

        if (stableFilters.search) queryParams.append('search', stableFilters.search);
        if (stableFilters.type) queryParams.append('type', stableFilters.type);
        if (stableFilters.rarity) queryParams.append('rarity', stableFilters.rarity);

        const apiUrl = `http://localhost:8000/cards?${queryParams.toString()}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setCards(data.data);
          setTotalPages(Math.ceil(data.totalCount / pageSize));
        } else {
          throw new Error(data.message || 'Error al obtener las cartas');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching Pokemon cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [page, pageSize, stableFilters.search, stableFilters.type, stableFilters.rarity]);

  return { cards, loading, error, totalPages };
};

export default useCards;
