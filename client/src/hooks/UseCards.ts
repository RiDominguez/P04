import { useState, useEffect } from 'react';

export const useCards = (currentPage: number, limit: number, search: string) => {
  const [cards, setCards] = useState<any[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);  // Para almacenar todas las cartas
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pokemon/cards?limit=1000`)  // Trae todas las cartas (sin paginación)
      .then((response) => response.json())
      .then((data) => {
        setAllCards(data.cards || []);
        setCards(data.cards || []); // Al principio muestra todas las cartas
        setTotalPages(Math.ceil((data.cards.length) / limit)); // Calcula el número total de páginas
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las cartas:', error);
        setLoading(false);
      });
  }, []);

  // Filtrado de las cartas según la búsqueda
  const filteredCards = allCards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación de las cartas filtradas
  const paginatedCards = filteredCards.slice((currentPage - 1) * limit, currentPage * limit);

  return { paginatedCards, loading, totalPages };
};
