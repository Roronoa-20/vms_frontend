import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const createPageRange = (currentPage: number, totalPages: number, delta = 2) => {
    const range: (number | string)[] = [];
    let lastPageAdded: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (lastPageAdded && i - lastPageAdded > 1) {
          range.push(`ellipsis-${i}`); // unique string key for ellipses
        }
        range.push(i);
        lastPageAdded = i;
      }
    }

    return range;
  };

  const pages = createPageRange(currentPage, totalPages);

  return (
    <div className="flex items-center space-x-2">
      {/* Prev */}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) =>
        typeof page === "string" && page.startsWith("ellipsis") ? (
          <span key={page} className="px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;