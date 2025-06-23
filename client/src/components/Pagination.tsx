import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={`flex justify-center items-center gap-6 my-8 ${className || ''}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        ◀ Anterior
      </button>

      <span className="text-gray-700 text-sm font-semibold">
        Página <span className="text-blue-600">{currentPage}</span> de {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        Siguiente ▶
      </button>
    </div>
  );
};

export default Pagination;
