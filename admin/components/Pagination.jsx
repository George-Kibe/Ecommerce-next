const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
 
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const goToNext =() => {
      paginate(currentPage + 1)
    }
    const goToPrevious = () => {
      paginate(currentPage - 1)
    }
    return (
      <ul className="flex flex-row gap-2 mt-4 self-center">
        {
          currentPage !== 1 && (
            <li className={`border-2 bg-blue-300 p-2 px-4  rounded-lg`}>
              <button onClick={goToPrevious}   className="page-link" >
                Previous
              </button>
            </li>
        )
        }        
        {pageNumbers.map(number => (
          <li key={number} className={`border-2 ${currentPage === number?"bg-blue-900 text-white":"bg-blue-300 "} p-2 px-4  rounded-lg`}>
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
        {
          currentPage !== totalPages && (
            <li className={`border-2 bg-blue-300 p-2 px-4  rounded-lg`}>
              <button onClick={goToNext} className="page-link" >
                Next
              </button>
            </li>
        )
        }        
       
      </ul>
    );
  };
export default Pagination;