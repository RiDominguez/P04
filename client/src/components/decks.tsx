import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Card {
  id: number;
  name: string;
  images: {
    small: string;
    large: string;
  };
}

interface Collection {
  id: number;
  name: string;
  cards?: Card[]; // Hacer cards opcional ya que se carga después
  
}

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [expandedCollectionId, setExpandedCollectionId] = useState<number | null>(null);
  const [inventory, setInventory] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 6; // solo para test

  const fetchCollections = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Error al obtener colecciones");
      }

      const data = await response.json();
      console.log("Datos completos de la API:", data);
      
    
      let collectionsData: Collection[] = [];
      
      if (Array.isArray(data)) {
        collectionsData = data;
      } else if (data.collections && Array.isArray(data.collections)) {
        collectionsData = data.collections;
      } else if (data.data && Array.isArray(data.data)) {
        collectionsData = data.data;
      }
      
      console.log("Datos de colecciones a guardar:", collectionsData);
      setCollections(collectionsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError("Error al cargar las colecciones");
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventory = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/cards`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al obtener inventario");
      }

      const data = await response.json();
      setInventory(data.cards ?? []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Error al cargar el inventario");
      setInventory([]);
    }
  };

  const fetchCards = async (collectionId: number) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:8000/collections/${collectionId}/cards`, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener cartas del mazo");
    }

    const data = await response.json();
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId ? { ...col, cards: data.cards || data } : col
      )
    );
  } catch (err) {
    console.error("Error fetching cards:", err);
    setError("Error al cargar las cartas del mazo");
  }
};

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCollectionName }),
      });

      if (!response.ok) {
        throw new Error("Error al crear colección");
      }

      setNewCollectionName("");
      await fetchCollections();
    } catch (err) {
      console.error("Error creating collection:", err);
      setError("Error al crear la colección");
    }
  };

  const handleAddCard = async (collectionId: number, cardId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/collections/${collectionId}/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cardId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al agregar carta al mazo");
      }

      await fetchCards(collectionId);
    } catch (err) {
      console.error("Error adding card:", err);
      setError("Error al agregar carta al mazo");
    }
  };

  const handleDeleteCard = async (collectionId: number, cardId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/collections/${collectionId}/cards/${cardId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar carta del mazo");
      }

      await fetchCards(collectionId);
    } catch (err) {
      console.error("Error deleting card:", err);
      setError("Error al eliminar carta del mazo");
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/collections/${collectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar colección");
      }

      await fetchCollections();
    } catch (err) {
      console.error("Error deleting collection:", err);
      setError("Error al eliminar la colección");
    }
  };

  const toggleExpand = async (collectionId: number) => {
    const isExpanding = expandedCollectionId !== collectionId;
    setExpandedCollectionId(isExpanding ? collectionId : null);

    if (isExpanding) {
      await fetchCards(collectionId);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCollections(), fetchInventory()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Mis Mazos</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Nombre del nuevo mazo"
            className="flex-1 border px-4 py-2 rounded shadow"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <button
            onClick={handleCreateCollection}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Crear
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center">Cargando mazos...</p>
        ) : collections.length === 0 ? (
          <p className="text-gray-500 text-center">No tienes mazos creados.</p>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="mb-4 bg-white shadow rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{collection.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleExpand(collection.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expandedCollectionId === collection.id ? "Cerrar" : "Ver cartas"}
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {expandedCollectionId === collection.id && (
                <>
                  <div className="mb-4">
                    <select
                      className="w-full border px-2 py-1 rounded"
                      onChange={(e) => {
                        const cardId = parseInt(e.target.value);
                        if (cardId) handleAddCard(collection.id, cardId);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Agregar carta desde inventario
                      </option>
                      {inventory.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!collection.cards || collection.cards.length === 0 ? (
                    <p className="text-gray-500">Este mazo no tiene cartas.</p>
                  ) : (
                    <ul className="space-y-1">
                      {collection.cards.map((card) => (
                        <li
                          key={card.id}
                          className="flex justify-between items-center border-b py-1"
                        >
                          <span>{card.name}</span>
                          <button
                            onClick={() => handleDeleteCard(collection.id, card.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Collections;


