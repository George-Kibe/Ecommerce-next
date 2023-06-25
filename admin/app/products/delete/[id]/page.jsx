"use client"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const DeleteProduct = ({params}) => {
  const [productData, setProductData] = useState(null)
  const {id} = params;
  const router = useRouter()
  const getProduct = async() => {
    try {
      const response = await axios.get(`/api/products?id=${id}`)
      setProductData(response.data)
    } catch (error) {
      toast.error("Product not found: 404")
    }
  }
  useEffect(() => {
    if(!id){return};
    getProduct()
  }, [id])
  
  const cancelDelete = () => {
    router.back()
  }
  const deleteProduct = async() => {
    try {
      const response = await axios.delete(`/api/products/${id}`)
      if (response.status === 200){
        toast.error("Deleted Successfully!")
        router.back()
      }
    } catch (error) {
      toast.error("Product not found: 404")
    }
  }
  if(!productData){
    return(
      <p className="text-center">Loading...</p>
    )
  }
  return (
    <div className="w-full h-full">
      <ToastContainer />
      <div className="flex flex-col gap-2 items-center justify-center flex-wrap">
        <p className="font-semibold text-xl">Are you sure you want to delete &nbsp;"{productData?.title}"?</p>
        
        <div className="flex flex-row gap-4">
          <button onClick={cancelDelete} className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white">Cancel</button>
          <button onClick={deleteProduct} className="bg-blue-900 p-2 px-4 flex flex-row gap-1 rounded-xl text-white">Yes</button>
        </div>
      </div> 
    </div>
  )
}

export default DeleteProduct