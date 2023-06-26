"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const Categories = () => {
  const [name, setName] = useState("")
  const saveCategory = async (e) => {
    e.preventDefault()
    if(!name){
        toast.error("Cannot save empty Category!")
        return
    }
    try {
        toast.info("Posting your category")
        const response = await axios.post('/api/categories')
        if(response.status === 201){
            toast.success("Category Added Successfully")
            setName("")
        }
    } catch (error) {
        toast.error("Category not Added. Try Again!")
    }
  }

  return (
    <div className='w-full h-full text-blue-900'>
        <ToastContainer />
        <h1 className="mb-2 font-semibold text-xl">All Categories</h1>
        <label>New Category</label>
        <form onSubmit={saveCategory} className="flex gap-1">
          <input type="text" placeholder='Category Name' 
            value={name}
            onChange={ev => setName(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 w-full focus:border-blue-900" />
            <button type='sumbit' className="p-2 bg-blue-900 text-white rounded-md">Save</button>
        </form>
        
    </div>
  )
}

export default Categories;