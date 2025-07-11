import React from 'react';

const FilterBar = ({ typeFilter, rarityFilter, setTypeFilter, setRarityFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Tipo</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Todos</option>
          <option value="Colorless">Normal</option>
          <option value="Darkness">Siniestro</option>
          <option value="Dragon">Dragón</option>
          <option value="Fairy">Hada</option>
          <option value="Fighting">Lucha</option>
          <option value="Fire">Fuego</option>
          <option value="Grass">Planta</option>
          <option value="Lightning">Eléctrico</option>
          <option value="Metal">Metálico</option>
          <option value="Psychic">Psíquico</option>
          <option value="Water">Agua</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Rareza</label>
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Todas</option>
          <option value="Common">Común</option>
          <option value="Uncommon">Poco común</option>
          <option value="Rare">Rara</option>
          <option value="Ultra Rare">Ultra rara</option>
          <option value="Secret Rare">Rara secreta</option>
          <option value="Promo">Promocional</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;


  