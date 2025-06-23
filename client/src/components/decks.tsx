import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

interface Card {
  id: number;
  name: string;
  official_id?: string;
  images?: { small: string };
}

interface Collection {
  id: number;
  name: string;
  cards?: Card[];
}

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [deckModal, setDeckModal] = useState<Collection | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [inventory, setInventory] = useState<Card[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const userId = 6;
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const withImages = (arr: any[]) =>
    arr.map((c) => {
      if (c.images?.small) return c;
      const [setId, num] = c.official_id?.split("-") || ["", ""];
      return { ...c, images: { small: `https://images.pokemontcg.io/${setId}/${num}.png` } };
    });

  const getDecks = async () => {
    const res = await fetch(`${API_URL}/users/${userId}/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCollections(Array.isArray(data) ? data : data.collections || []);
  };

  const getInventory = async () => {
    const res = await fetch(`${API_URL}/users/${userId}/cards`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    setInventory(withImages(d.cards || d));
  };

  const getDeckCards = async (id: number) => {
    const res = await fetch(`${API_URL}/collections/${id}/cards`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    return withImages(d.cards || d);
  };

  const openDeck = async (col: Collection) => {
    const cards = await getDeckCards(col.id);
    setDeckModal({ ...col, cards });
    setSelectedDeck(col.id);
    setShowDeckModal(true);
  };

  const openEditDeck = async (col: Collection) => {
    const cards = await getDeckCards(col.id);
    setDeckModal({ ...col, cards });
    setSelectedDeck(col.id);
    setShowEditModal(true);
  };

  const addCard = async (deckId: number, userCardId: number) => {
    await fetch(`${API_URL}/users/${userId}/collections/${deckId}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_card_id: userCardId }),
    });
    const cards = await getDeckCards(deckId);
    setDeckModal((d) => (d && d.id === deckId ? { ...d, cards } : d));
  };

  const removeCard = async (deckId: number, userCardId: number) => {
    await fetch(`${API_URL}/users/${userId}/collections/${deckId}/cards/${userCardId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const cards = await getDeckCards(deckId);
    setDeckModal((d) => (d && d.id === deckId ? { ...d, cards } : d));
  };

  const createDeck = async () => {
    if (!newDeckName.trim()) return;
    await fetch(`${API_URL}/users/${userId}/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newDeckName }),
    });
    setNewDeckName("");
    getDecks();
  };

  useEffect(() => {
    getDecks();
    getInventory();
  }, []);

  const progress = (n: number) => Math.min(100, (n / 60) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-24 max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Mis Mazos</h1>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Nombre del nuevo mazo"
            className="flex-1 bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createDeck()}
          />
          <button
            onClick={createDeck}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>

        {collections.map((c) => (
          <div key={c.id} className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center">
            <span className="font-semibold text-lg">{c.name}</span>
            <div className="flex gap-2">
              <button onClick={() => openEditDeck(c)} className="bg-blue-600 px-3 py-1 rounded">Editar mazo</button>
            </div>
          </div>
        ))}
      </main>

      {showDeckModal && deckModal && (
        <Modal title={deckModal.name} onClose={() => setShowDeckModal(false)}>
          <div className="space-y-2">
            {deckModal.cards?.map((card) => (
              <div key={card.id} className="flex items-center gap-2">
                <img src={card.images?.small} alt={card.name} className="w-10 h-14 rounded-md" />
                <span>{card.name}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showEditModal && deckModal && selectedDeck && (
        <Modal title={`Editar: ${deckModal.name}`} onClose={() => setShowEditModal(false)}>
          <div className="flex gap-6">
            <div className="w-1/2 bg-[#1c1c24] text-white p-4 rounded-xl shadow-lg">
              <div className="flex justify-between mb-4 text-sm">
                <div>
                  <div className="text-gray-400">Formato</div>
                  <div className="font-semibold">Standard</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400">Cartas</div>
                  <div className="font-semibold">{deckModal.cards?.length}/60</div>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full mb-4">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${progress(deckModal.cards?.length || 0)}%` }} />
              </div>
              <div className="text-sm uppercase text-gray-400 font-bold flex justify-between border-b border-gray-700 pb-1 mb-2">
                <span>Nombre</span>
                <span>Qty</span>
              </div>
              {deckModal.cards?.map((card) => (
                <div key={card.id} className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 rounded-lg p-2 mb-2">
                  <div className="flex items-center gap-2">
                    <img src={card.images?.small} alt={card.name} className="w-8 h-8 rounded-md" />
                    <span>{card.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeCard(deckModal.id, card.id)} className="bg-gray-700 px-2 rounded">eliminar</button>
                    <span>1</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-1/2">
              <h3 className="text-lg font-semibold mb-2">Inventario</h3>
              <div className="grid grid-cols-2 gap-4">
                {inventory.map((card) => {
                  const isInDeck = deckModal.cards?.some((c) => c.id === card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => addCard(deckModal.id, card.id)}
                      className={`cursor-pointer p-2 rounded-lg flex flex-col items-center ${
                        isInDeck ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <img src={card.images?.small} className="w-20 h-28 mb-1" />
                      <span className="text-sm text-center">{card.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Collections;
