import React from "react";

interface PaginationProps {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages } = pagination;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-4 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`flex items-center justify-center px-4 py-2 mx-1 rounded-md rtl:-scale-x-100 ${
          page === 1
            ? "bg-white text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
            : "bg-white text-gray-700 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary"
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 mx-1 rounded-md transition-colors duration-300 ${
            p === page
              ? "bg-primary text-white "
              : "bg-white text-gray-700 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center justify-center px-4 py-2 mx-1 rounded-md rtl:-scale-x-100 ${
          page === totalPages
            ? "bg-white text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
            : "bg-white text-gray-700 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary"
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
