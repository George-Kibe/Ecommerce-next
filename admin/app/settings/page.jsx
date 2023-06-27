"use client"
import React, { useEffect, useState } from 'react'
const data = [
	{
		"_id": "6495b146df662ccaa8441080",
		"title": "This is just a test ()updated",
		"description": "This is just a test",
		"price": 890,
		"createdAt": "2023-06-23T14:50:46.580Z",
		"updatedAt": "2023-06-25T15:58:23.034Z",
		"__v": 0
	},
	{
		"_id": "6495b282df662ccaa8441082",
		"title": "Test Product from Postman(updated)",
		"description": "This is just a test description from postman. Seems so far so good",
		"price": 900,
		"createdAt": "2023-06-23T14:56:02.898Z",
		"updatedAt": "2023-06-25T15:30:36.666Z",
		"__v": 0
	},
	{
		"_id": "6495c0a9df662ccaa8441087",
		"title": "Test Product from Postman",
		"description": "This is just a test description from postman. Seems so far so good",
		"price": 900,
		"createdAt": "2023-06-23T15:56:25.554Z",
		"updatedAt": "2023-06-23T15:56:25.554Z",
		"__v": 0
	},
	{
		"_id": "6495dada93af5a170fdbf3c0",
		"title": "Last Test Product",
		"description": "This is the Last Test Product",
		"price": 8903536,
		"createdAt": "2023-06-23T17:48:10.785Z",
		"updatedAt": "2023-06-23T17:48:10.785Z",
		"__v": 0
	},
	{
		"_id": "64960d78b8e0c9ac895a76f9",
		"title": "Test Again for delay",
		"description": "This is just a test",
		"price": 435,
		"createdAt": "2023-06-23T21:24:08.876Z",
		"updatedAt": "2023-06-23T21:24:08.876Z",
		"__v": 0
	},
	{
		"_id": "64960da7b8e0c9ac895a76fc",
		"title": "Last Test",
		"description": "This is just a test. This is just a test",
		"price": 546,
		"createdAt": "2023-06-23T21:24:55.395Z",
		"updatedAt": "2023-06-25T16:14:27.459Z",
		"__v": 0
	},
	{
		"_id": "649841bb62077a589d6f5108",
		"title": "Test after Refactoring",
		"description": "Test after rfactoring(updated)",
		"price": 9080,
		"createdAt": "2023-06-25T13:31:39.890Z",
		"updatedAt": "2023-06-25T15:33:13.210Z",
		"__v": 0
	},
	{
		"_id": "649855402211a5a29760cbbe",
		"title": "This is test number 10",
		"description": "This is test numbe(updated)",
		"price": 89023,
		"createdAt": "2023-06-25T14:54:56.961Z",
		"updatedAt": "2023-06-25T15:33:26.879Z",
		"__v": 0
	}
]
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
    <div className="w-full -h-full px-2">
      <li className={`page-item`}>
        {
          currentPage !== 1 && (
            <button onClick={goToPrevious}   className="page-link" >
              Previous
            </button>
          )
        }        
      </li>
      {pageNumbers.map(number => (
        <li key={number} className="page-item">
          <a onClick={() => paginate(number)} href="#" className="page-link">
            {number}
          </a>
        </li>
      ))}

      <li className={`page-item`}>
        {
          currentPage !== totalPages && (
            <a onClick={goToNext} className="page-link" >
              Next
            </a>
          )
        }        
      </li>
    </div>
  );
};

const Settings = () => {
  const BluetoothSyncAPIService = async() => {
    const BLUETOOTH_SYNC_API = 'https://randomuser.me/api/?results=1000';
    try {
      const response = await fetch(BLUETOOTH_SYNC_API) 
      const data =await response.json()
      console.log("Response: ", data)
      console.log(response.results)
      return response
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    BluetoothSyncAPIService()
  }, [])
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  // Get current items based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='w-full h-full p-2'>
      {/* Display your items */}
      {currentItems.map(item => (
        <div key={item._id}>{item.title}</div>
      ))}

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Settings