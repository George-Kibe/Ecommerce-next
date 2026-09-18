"use client"
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import React, { use, useEffect, useState } from 'react'
import ProductForm from '@/components/ProductForm';

const EditProductData = ({params}) => {
  const [productData, setProductData] = useState(null)
  // Next 16 passes `params` as a promise; client components unwrap it with use().
  const {id} = use(params);
  const getProduct = async() => {
    try {
      const response = await axios.get(`/api/products?id=${id}`)
      setProductData(response.data)
    } catch (error) {
      toast.error("Product not found: 404")
    }
  }

  useEffect(() => {
    if(!id){return}
    getProduct()
  }, [id])  

  if (!productData){
    return(
      <div className="w-full h-full px-2 p-4">
        <p className="text-center">Loading...</p>  
      </div>      
    )
  } 
  return (
    <ProductForm {...productData} />
  )
}

export default EditProductData