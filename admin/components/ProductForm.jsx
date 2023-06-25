"use client"
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = ({_id:id, title:existingTitle, description:existingDescription, price:existingPrice}) => {
  console.log("ID: ", id)
  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const router = useRouter();
  const pathname = usePathname()

  const saveProduct = async(e) => {
    e.preventDefault()
    if(!title| !description |!price){
      toast.error("You have missing details!");
      return
    }
    const data = {title, description, price}
    if(id){
      toast.info("Editing your Product in the Database")
      try {
        const response = await axios.put("/api/products/", {...data, _id:id})
        console.log(response)
        if(response.status === 200){
            toast.success("Product added successfully to database")
            setTimeout(router.push("/products"), 8000); 
            
        }else{
            toast.error("Product not Edited. Try again!")
        }
      } catch (error) {
        
      }
    }else{
      toast.info("Adding your Product to Database")
      try {
        const response = await axios.post("/api/products/", data)
        console.log(response)
        if(response.status === 201){
            toast.success("Product added successfully to database")
            setTimeout(router.push("/products"), 8000); 
            
        }else{
            toast.error("Product not added to database. Try again!")
        }
      } catch (error) {
        
      }
    }
  }
  
  return (
    <div className="w-full h-full">
      <ToastContainer />
      <form onSubmit={saveProduct} className="text-blue-900 flex flex-col p-4">
        <h1 className="mb-2 text-xl">{pathname.includes("edit")?"Edit Product": "New Product"}</h1>
        <label>Product Name</label>
        <input type="text" placeholder='Product name' 
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900" />
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

export default ProductForm