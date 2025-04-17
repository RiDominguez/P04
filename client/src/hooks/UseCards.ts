import { useState, useEffect } from 'react';

interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  // Agrega más propiedades según necesites
}

const useCards = (page: number, pageSize: number, search: string = '') => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Reemplaza con la URL de tu endpoint backend
        const apiUrl = `http://localhost:8000/cards?page=${page}&pageSize=${pageSize}${
          search ? `&search=${encodeURIComponent(search)}` : ''
        }`;
        
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
  }, [page, pageSize, search]);

  return { cards, loading, error, totalPages };
};

export default useCards;
