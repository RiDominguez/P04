import React, { useRef } from 'react';

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar cartas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
