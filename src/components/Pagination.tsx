// components/Pagination.tsx
interface PaginationProps {
    page: number;
    total: number;
    limit: number;
    handlePagination: (newPage: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ page, total, limit, handlePagination }) => {
    const totalPages = Math.ceil(total / limit);
  
    // Generate page numbers with ellipses if needed
    const getPaginationRange = () => {
      const range: number[] = [];
      
      if (totalPages <= 7) {
        // Show all pages if there are 7 or fewer pages
        for (let i = 1; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        if (page <= 4) {
          // Show the first 5 pages
          range.push(1, 2, 3, 4, 5, -1, totalPages);
        } else if (page > totalPages - 4) {
          // Show the last 5 pages
          range.push(1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          // Show the current page, with 2 pages before and 2 pages after
          range.push(1, -1, page - 2, page - 1, page, page + 1, page + 2, -1, totalPages);
        }
      }
  
      return range;
    };
  
    const paginationRange = getPaginationRange();
  
    return (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => handlePagination(page - 1)}
          disabled={page <= 1}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg disabled:opacity-40"
        >
          ⬅️ Previous
        </button>
        {paginationRange.map((pageNum, index) => (
          pageNum === -1 ? (
            <span key={index} className="text-gray-300">...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePagination(pageNum)}
              className={`px-4 py-2 rounded-lg ${
                page === pageNum
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {pageNum}
            </button>
          )
        ))}
        <button
          onClick={() => handlePagination(page + 1)}
          disabled={page >= totalPages}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg disabled:opacity-40"
        >
          Next ➡️
        </button>
      </div>
    );
  };
  
  export default Pagination;
  