import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center mt-6 gap-2">
      <button
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
          currentPage === 1 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-[#008500] hover:bg-[#006700] text-white hover:shadow-md"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
        Trước
      </button>

      <div className="mx-4 flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;
          const showPage = (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          );

          return showPage ? (
            <button
              key={page}
              className={`w-10 h-10 rounded-md flex items-center justify-center ${
                isCurrent
                  ? "bg-[#008500] text-white font-semibold shadow-sm"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : null;
        })}
      </div>

      <button
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
          currentPage === totalPages 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-[#008500] hover:bg-[#006700] text-white hover:shadow-md"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 ml-1" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
