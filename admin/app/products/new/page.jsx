"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNewProduct = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter();

  const saveProduct = async(e) => {
    e.preventDefault()
    if(!title| !description |!price){
      toast.error("You have missing details!");
      return
    }
    toast.info("Adding your Product to Database")
    const data = {title, description, price}
    const response = await axios.post("/api/products/", data)
    console.log(response)
    if(response.status === 201){
        toast.success("Product added successfully to database")
        setTitle(""); setDescription(""); setPrice("")
        router.push("/products")
    }else{
        toast.error("Product not added to database. Try again!")
    }
  }
  
  return (
    <div className="w-full h-full">
      <ToastContainer />
      <form onSubmit={saveProduct} className="text-blue-900 flex flex-col p-4">
        <h1 className="mb-2 text-xl">New Product</h1>
        <label>Product Name</label>
        <input type="text" placeholder='Product name' 
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 self-start mb-2 focus:border-blue-900" />
        <label>Product Description</label>
        <textarea name="" id="" cols="30" rows="5" 
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder='Product Description'
            className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900">
        </textarea>
        <label>Price (in Kshs)</label>
        <input type="text" placeholder='Price' 
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 self-start mb-2 focus:border-blue-900" />
        <button type='submit' className='bg-blue-900 text-white p-2 rounded-xl self-start'>Save Product</button>
        </form>   
    </div>
  )
}

export default AddNewProduct