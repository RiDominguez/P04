import React from 'react';

const FilterBar = ({ typeFilter, rarityFilter, setTypeFilter, setRarityFilter }) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All</option>
            <option value="Fire">Fire</option>
            <option value="Water">Water</option>
            <option value="Grass">Grass</option>
            <option value="Electric">Electric</option>
            {/* Otros tipos */}
          </select>
        </div>
  
        <div>
          <label className="block text-sm text-gray-700 mb-1">Rarity</label>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Ultra Rare">Ultra Rare</option>
          </select>
        </div>
      </div>
    );
  };

export default FilterBar;
  