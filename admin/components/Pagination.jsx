/*
  Page numbers were <a href="#"> with an onClick handler: they moved focus to
  the top of the document, polluted browser history, and were announced as
  links to a place rather than controls. They're real <button>s now, sized to
  the 44pt HIG minimum, with the current page marked via aria-current rather
  than by colour alone.
*/
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const control =
    "border-2 bg-blue-300 min-w-11 min-h-11 inline-flex items-center justify-center px-4 rounded-lg";

  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-row flex-wrap gap-2 mt-4 self-center">
        {currentPage !== 1 && (
          <li>
            <button type="button" onClick={() => paginate(currentPage - 1)} className={control}>
              Previous
            </button>
          </li>
        )}

        {pageNumbers.map((number) => {
          const isCurrent = currentPage === number;
          return (
            <li key={number}>
              <button
                type="button"
                onClick={() => paginate(number)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${number}`}
                className={`border-2 min-w-11 min-h-11 inline-flex items-center justify-center px-4 rounded-lg ${
                  isCurrent ? "bg-blue-900 text-white font-semibold" : "bg-blue-300"
                }`}
              >
                {number}
              </button>
            </li>
          );
        })}

        {currentPage !== totalPages && (
          <li>
            <button type="button" onClick={() => paginate(currentPage + 1)} className={control}>
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
