import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface TradeCard {
  id: number;
  name: string;
  rarity: string;
  type: string;
  expansion: string;
  official_id: string;
  condition: string;
  is_for_trade: boolean;
  market_price?: number;
  images?: {
    small: string;
  };
}

const Trade: React.FC = () => {
  const [cards, setCards] = useState<TradeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 6;
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTradeCards = async () => {
      try {
        if (!token) throw new Error("No autenticado");

        const res = await fetch(`${API_URL}/users/${userId}/trade-cards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();

        const cardsWithImages = data.cards.map((card: any) => {
          const [setId, cardNumber] = card.official_id.split("-");
          return {
            ...card,
            images: {
              small: `https://images.pokemontcg.io/${setId}/${cardNumber}.png`,
            },
          };
        });

        setCards(cardsWithImages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeCards();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Cartas Disponibles para Intercambio
        </h1>

        {loading && <p className="text-center text-gray-600">Cargando cartas...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={card.images?.small} alt={card.name} className="w-full" />
              <div className="p-4">
                <h2 className="font-bold text-lg">{card.name}</h2>
                <p className="text-sm text-gray-600">Rareza: {card.rarity}</p>
                <p className="text-sm text-gray-600">Expansión: {card.expansion}</p>
                <p className="text-sm text-gray-600">Condición: {card.condition}</p>
                <p className="text-sm text-gray-800 font-semibold mt-2">
                  Precio estimado:{" "}
                  {card.market_price ? `$${card.market_price.toFixed(2)}` : "No disponible"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trade;
