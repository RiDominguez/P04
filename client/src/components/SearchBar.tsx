import React from 'react';

interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Buscar cartas"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: '0.5rem',
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default SearchBar;
