import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 6; 
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(start + maxVisible - 1, totalPages);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold transition-all
            ${currentPage === page
              ? 'bg-[#1F2937] text-white shadow-md' // Active: Dark Navy/Black
              : 'bg-[#F3F4F6] text-gray-600 hover:bg-gray-200' // Inactive: Light Gray
            }
          `}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;