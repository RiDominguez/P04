import React, { useRef } from 'react';

const SearchBar = ({ search, setSearch }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar cartas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '0.5rem 2rem 0.5rem 1rem',
          width: '100%',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      {search && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;