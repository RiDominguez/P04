import React from "react";

interface CardData {
  id: string;
  name: string;
  rarity: string;
  type: string;
  expansion: string;
  official_id: string;
  condition: string;
  is_for_trade: boolean;
  images: {
    small: string;
    large?: string;
  };
}

interface InventoryCardListProps {
  cards: CardData[];
  onEditCondition: (cardId: string, newCondition: string) => void;
  onDelete: (cardId: string) => void;
}

const InventoryCardList: React.FC<InventoryCardListProps> = ({
  cards,
  onEditCondition,
  onDelete,
}) => {
  if (cards.length === 0) {
    return <div className="text-center text-gray-500">No tienes cartas aún.</div>;
  }

  const handleEdit = (card: CardData) => {
    const nuevoEstado = prompt(
      `Estado actual: ${card.condition}. Ingrese nuevo estado para la carta: 
      "Nuevo",
      "Excelente",
      "Bueno",
      "Aceptable",
      "Dañado", `,
      card.condition
    );
    if (nuevoEstado && nuevoEstado !== card.condition) {
      onEditCondition(card.id, nuevoEstado);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="border rounded p-2">
          <img
            src={card.images.small}
            alt={card.name}
            className="w-full rounded-lg"
          />
          <h3 className="mt-2 font-semibold">{card.name}</h3>
          <p className="text-sm text-gray-600">Estado: {card.condition}</p>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => handleEdit(card)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryCardList;
