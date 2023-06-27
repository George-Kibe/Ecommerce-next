"use client"
import axios from 'axios'
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@/components/DeleteModal';

const Categories = () => {
  const [name, setName] = useState("")
  const [parentCategory, setParentCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [properties, setProperties] = useState([])
  const initiateDelete = (category) => {
    // console.log(category)
    setCategoryToDelete(category)
    setIsOpen(true);
  }

  const getCategories = async() => {
    try {
      const response = await axios.get("/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])
  
  const saveCategory = async (e) => {
    e.preventDefault()
    if(!name){
        toast.error("Cannot save empty Category!")
        return
    }
    const data = {
      name, 
      parentCategory,
      properties: properties?.map( p => ({
        name:p.name,
        values:p.values.split(",")
      }))
    }
    if(editingCategory){
      try {
        data._id=editingCategory._id
        const response = await axios.put("/api/categories",data)
        if(response.status === 200){
          setName(""); 
          setEditingCategory(""); 
          setProperties([]);
          await getCategories();
          toast.success("Category Edited Successfully")
        }
        return
      } catch (error) {
        console.log(error.message)
        toast.error("Category Editing Error")
        return
      }
      
    }
    try {
        toast.info("Posting your category")
        const response = await axios.post('/api/categories', data)
        // console.log(response)
        if(response.status === 201){
          setName("");
          await getCategories();
          setProperties([])
          toast.success("Category Added Successfully")
        }
    } catch (error) {
        console.log(error.message)
        toast.error("Category not saved. Try Again!")
    }
  }
  const editCategory = (category) => {
    // console.log(category)
    setEditingCategory(category)
    setName(category.name)
    category.parentCategory && setParentCategory(category.parentCategory._id)  
    category.properties.length > 0 && setProperties(category.properties.map(({name, values}) => ({
      name,
      values:values.join(",")
    })))
  }
  const addProperty = () => {
    setProperties(prev => {
      return [...prev, {name:"", values:""}]
    })
  }
  const handlePropertyNameChange = (index, property, newName) => {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }
  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    })
  }
  const removeProperty = (index)=> {
    const newProperties = properties.filter((prop, pIndex) => pIndex!==index)
    setProperties(newProperties)
  }

  return (
    <div className='w-full h-full text-blue-900 py-4'>
        <ToastContainer />
        <div>
          <Modal setIsOpen={setIsOpen} categoryToDelete={categoryToDelete} isOpen={isOpen} 
           toast={toast} getCategories={getCategories}
          />
        </div>
        <h1 className="mb-2 font-semibold text-xl">All Categories</h1>
        <label>
          { editingCategory? `Edit Category -${editingCategory.name}` : "Add a new Category"}
        </label>
        <form onSubmit={saveCategory} className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <input type="text" placeholder='Category Name' 
              value={name}
              onChange={ev => setName(ev.target.value)}
              className="border-2 border-gray-300 mb-2 rounded-md p-1 focus:border-blue-900" />
              <select value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}
              className='border-2 border-gray-300 rounded-md mb-2 p-1 focus:border-blue-900"'>
                <option value="">No Parent Category</option>
                {
                  categories.length > 0 && categories.map((category, index) => (
                  <option value={category._id} key={index}>{category.name}</option>
                ))
              }
            </select>
          </div>
            <div className="mb-2">
              <label className='block mb-2 font-semibold'>Properties</label>
              <button onClick={addProperty} type="button" className="block bg-gray-600 p-2 mb-2 rounded-md text-white text-sm">Add new Property</button>
              {
                properties.length > 0 && properties.map((property, index) => (
                  <div className="flex gap-1 mb-1" key={index}>
                    <input type="text" value={property.name} 
                      onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                      placeholder='property name eg. Color' className="border p-1" />
                    <input type="text" value={property.values} 
                      onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}
                      placeholder='values, comma separated' className="border p-1" />
                    <button onClick={() => removeProperty(index)} type="button" className="block bg-gray-600 p-2 rounded-md text-white text-sm">Remove</button>
                  </div>
                ))
              }
            </div>     
            <div className="flex gap-2">
              {
                editingCategory &&
                  <button onClick={() => {setEditingCategory(null); setName(""); setProperties([]); setParentCategory("")}}
                   type="button" className="block bg-gray-600 p-2 rounded-md text-white text-sm">Cancel</button>
                }
              <button type='sumbit' className="self-start p-2 px-4 bg-blue-900 text-white rounded-md">Save</button>
            </div>
        </form>
        {
          !editingCategory && (
            <table className="border border-gray-400 p-2 w-full mt-4">
              <thead className="bg-blue-100 p-2">
                <tr className="border border-gray-400 ">
                  <td className="border border-gray-400  p-1">#</td>  
                  <td className="border border-gray-400  p-1">Category Name</td>
                  <td className="border border-gray-400  p-1">Parent Category Name</td>
                  <td className="border border-gray-400  p-1">Created</td>
                  <td className="border border-gray-400  p-1">Action</td>
                </tr>
              </thead>
              <tbody className="border border-gray-400  p-1">
                {
                  categories.map((category, index) => (
                    <tr className="border border-gray-400  p-1" key={category._id}>
                      <td className="border border-gray-400  p-1">{index}</td>
                      <td className="border border-gray-400  p-1">{category.name}</td>
                      <td className="border border-gray-400  p-1">{category.parentCategory?.name || ""}</td>
                      <td className="border border-gray-400  p-1">・{moment(category.createdAt).calendar()}</td>
                      <td className="border border-gray-400 ">
                        <div className="flex flex-row p-1 pl-2">
                          <button onClick={() => editCategory(category)}
                            className='bg-blue-900 p-2 mr-2 flex flex-row gap-1 text-white rounded-xl'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => initiateDelete(category)} className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <p className="">Delete</p>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table> 
          )
        }
        
        
    </div>
  )
}

export default Categories;