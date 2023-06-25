"use client"
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import ProductForm from '@/components/ProductForm';

const EditProductData = ({params}) => {
  const [productData, setProductData] = useState(null)
  const {id} = params;
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
      <p className="text-center">Loading</p>
    )
  } 
  return (
    <ProductForm {...productData} />
  )
}

export default EditProductData