import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InventoryCardList from "../InventoryCardList";

const mockCard = {
  id: 1,
  name: "Charizard",
  rarity: "Rare Holo",
  type: "Fire",
  expansion: "Base Set",
  official_id: "base1-4",
  condition: "excellent",
  is_for_trade: true,
  market_price: 12.34,
  images: {
    small: "https://images.pokemontcg.io/base1/4.png",
  },
};

describe("InventoryCardList component", () => {
  it("muestra la carta correctamente con precio y estado", () => {
    render(
      <InventoryCardList
        cards={[mockCard]}
        onEditCondition={jest.fn()}
        onDelete={jest.fn()}
        onToggleTrade={jest.fn()}
      />
    );

    expect(screen.getByText("Charizard")).toBeInTheDocument();
    expect(screen.getByText("Estado: excellent")).toBeInTheDocument();
    expect(screen.getByText("Precio estimado: $12.34")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("muestra mensaje si no hay cartas", () => {
    render(
      <InventoryCardList
        cards={[]}
        onEditCondition={jest.fn()}
        onDelete={jest.fn()}
        onToggleTrade={jest.fn()}
      />
    );

    expect(screen.getByText("No tienes cartas aún.")).toBeInTheDocument();
  });

  it("llama onToggleTrade cuando cambia checkbox", () => {
    const onToggle = jest.fn();

    render(
      <InventoryCardList
        cards={[mockCard]}
        onEditCondition={jest.fn()}
        onDelete={jest.fn()}
        onToggleTrade={onToggle}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(1, false);
  });

  it("llama onDelete cuando se hace click en eliminar", () => {
    const onDelete = jest.fn();

    render(
      <InventoryCardList
        cards={[mockCard]}
        onEditCondition={jest.fn()}
        onDelete={onDelete}
        onToggleTrade={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Eliminar"));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
