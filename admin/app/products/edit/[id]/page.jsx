"use client"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ProductForm from '@/components/ProductForm';

const EditProductData = ({params}) => {
  const [ProductData, setProductData] = useState(null)
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

  return (
    <ProductForm {...ProductData} />
  )
}

export default EditProductData