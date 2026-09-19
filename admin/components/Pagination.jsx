/*
  Real <button>s (not <a href="#">), 44px targets, and the current page marked
  with aria-current as well as colour.
*/
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line px-3 font-medium text-fg hover:bg-hover disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="mt-4 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <button type="button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={control}>
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => {
          const isCurrent = currentPage === number;
          return (
            <li key={number}>
              <button
                type="button"
                onClick={() => paginate(number)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${number}`}
                className={`${control} ${isCurrent ? "border-accent bg-accent font-semibold text-on-accent hover:bg-accent" : "bg-surface"}`}
              >
                {number}
              </button>
            </li>
          );
        })}
        <li>
          <button type="button" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={control}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
