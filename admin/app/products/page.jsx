"use client"
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const AllProducts = () => {
  const [products, setProducts] = useState([])

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
            products.map((product, index) => (
              <tr className="border p-1">
                <td className="border p-1">{index+1}</td>
                <td className="border p-1">{product.title}</td>
                <td className="border p-1">{product.price}</td>
                <td className="border p-1 flex-wrap">{product.description}</td>
                {/* <td className="border p-1">{moment(product.createdAt).format('YYYY-MM-DD')}</td> */}
                <td className="border p-1">・{moment(product.createdAt).fromNow()}</td>
                <td className="border p-2">
                  <Link href={`/products/${product._id}`} className='bg-blue-900 p-2 mr-2 text-white rounded-xl'>

                    Edit
                  </Link>
                  <button className="bg-red-500 p-2 rounded-xl text-white">Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>      
    </div>   
  )
}

export default AllProducts