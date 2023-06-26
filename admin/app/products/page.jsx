"use client"
import Pagination from '@/components/Pagination'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  // Get current items based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const getProducts = async() => {
    try {
      const response = await axios.get('/api/products')
      // console.log("Products:", response.data)
      setProducts(response.data)
    } catch (error) {
      console.log("fetching products error!")
    }
  }
  useEffect(() => {
    getProducts()
  }, [])
  
  return (
    <div className="p-4">
      <ToastContainer />
      <div className="">
        <Link href={"/products/new"} className='bg-blue-900 text-white p-2 rounded-xl'>Add New Product</Link>
      </div>
      {
        products.length < 1 &&
          (
            <div className="mt-4">
              No Product Yet
            </div>
          )
      }  
      <table className="border border-gray-300 p-2 w-full mt-4">
        <thead className="bg-blue-100 p-2">
          <tr className="border">
            <td className="border p-1">#</td>  
            <td className="border p-1">Product Name</td>
            <td className="border p-1">Product Price</td>
            <td className="border p-1">Product Description</td>
            <td className="border p-1">Created</td>
            <td className="border p-1">Action</td>
          </tr>
        </thead>
        <tbody className="border p-1">
          {
            currentProducts.map((product, index) => (
              <tr className="border p-1">
                <td className="border p-1">{index+1}</td>
                <td className="border p-1">{product.title}</td>
                <td className="border p-1">{product.price}</td>
                <td className="border p-1 flex-wrap">{product.description}</td>
                {/* <td className="border p-1">{moment(product.createdAt).format('YYYY-MM-DD')}</td> */}
                <td className="border p-1">・{moment(product.createdAt).calendar()}</td>
                <td className="border flex flex-row p-2">
                  <Link href={`/products/edit/${product._id}`} className='bg-blue-900 p-2 mr-2 flex flex-row gap-1 text-white rounded-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </Link>
                  <Link href={`/products/delete/${product._id}`} className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <p className="">Delete</p>
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table> 
      <div className="w-full flex flex-col items-center">
        <Pagination 
          itemsPerPage={itemsPerPage}
          totalItems={products.length}
          paginate={paginate}
          currentPage={currentPage}
        />  
      </div>       
    </div>   
  )
}

export default AllProducts