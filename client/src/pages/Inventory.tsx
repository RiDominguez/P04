import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import InventoryCardList from "../components/InventoryCardList";

interface Card {
  id: number;
  name: string;
  rarity: string;
  type: string;
  expansion: string;
  official_id: string;
  condition: string;
  is_for_trade: boolean;
  images?: {
    small: string;
  };
}

const Inventory: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 6; // Cambiar a dinámico con login si es necesario
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/users/${userId}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error al obtener las cartas");
      }

      const data = await response.json();
      setCards(
        data.cards.map((card: any) => {
          const [setId, cardNumber] = card.official_id.split("-");
          return {
            ...card,
            images: {
              small: `https://images.pokemontcg.io/${setId}/${cardNumber}.png`,
            },
          };
        })
      );
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleEditCondition = async (cardId: number, newCondition: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const response = await fetch(`${API_URL}/users/${userId}/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ condition: newCondition }),
      });

      if (!response.ok) throw new Error("No se pudo actualizar el estado");

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, condition: newCondition } : card
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleToggleTrade = async (cardId: number, isForTrade: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const response = await fetch(`${API_URL}/users/${userId}/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_for_trade: isForTrade }),
      });

      if (!response.ok) throw new Error("Error al actualizar el estado de intercambio");

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, is_for_trade: isForTrade } : card
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (cardId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta carta?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autorizado");

      const response = await fetch(`${API_URL}/users/${userId}/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("No se pudo eliminar la carta");

      setCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Mi Inventario
        </h1>

        {loading && (
          <div className="text-center py-12 text-gray-500 text-lg">
            Cargando cartas...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600 text-lg">Error: {error}</div>
        )}

        {!loading && !error && (
          <InventoryCardList
            cards={cards}
            onEditCondition={handleEditCondition}
            onDelete={handleDelete}
            onToggleTrade={handleToggleTrade}
          />
        )}
      </main>
    </div>
  );
};

export default Inventory;



