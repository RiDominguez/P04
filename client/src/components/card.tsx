import React, { useState } from "react";

type CardProps = {
  card: {
    id: string;  // official_id
    name: string;
    number: string;
    price?: number;
    images: {
      small: string;
      large: string;
    };
  };
};

const estadosCarta = [
  "Nuevo",
  "Excelente",
  "Bueno",
  "Aceptable",
  "Dañado",
];

const Card = ({ card }: CardProps) => {
  const [cantidad, setCantidad] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAddClick = async () => {
    const estado = window.prompt(
      `Selecciona el estado de la carta:\n${estadosCarta.join(", ")}`,
      estadosCarta[0]
    );

    if (!estado || !estadosCarta.includes(estado)) {
      alert("Estado inválido o cancelado");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const getUserIdFromToken = (token: string): number => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          if (!payload.id) throw new Error("Token sin ID de usuario");
          return parseInt(payload.id);
        } catch (error) {
          throw new Error("Token inválido");
        }
      };

      const userId = getUserIdFromToken(token);

      const requestBody = {
        official_id: card.id,
        condition: estado,
        is_for_trade: false,
      };

      const response = await fetch(`${API_URL}/users/${userId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        mode: "cors",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      await response.json();
      setCantidad(prev => prev + 1);
      alert("Carta añadida correctamente al inventario");

    } catch (error: any) {
      alert(`Error: ${error.message || "No se pudo añadir la carta"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow border border-gray-200 w-full hover:shadow-lg transition duration-300">
      <img
        src={card.images.small}
        alt={`Carta de ${card.name}`}
        className="w-full object-cover rounded-t"
      />
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-900">{card.name}</h3>
        <p className="text-xs text-gray-500">{card.number}/159</p>

        <div className="flex justify-center items-center gap-2 mt-2 text-sm text-gray-600">
          <button
            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            disabled={cantidad === 0 || isLoading}
            onClick={() => setCantidad(Math.max(0, cantidad - 1))}
          >
            −
          </button>
          <span>{cantidad}</span>
          <button
            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            onClick={handleAddClick}
            disabled={isLoading}
          >
            {isLoading ? "..." : "+"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
