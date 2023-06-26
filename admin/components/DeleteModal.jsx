"use client"
import axios from 'axios';
import React from 'react';

const Modal = ({ isOpen, categoryToDelete:category, setIsOpen, getCategories, toast }) => {
  const cancelDelete = () => {
    setTimeout(() => {
        setIsOpen(false);
      }, 300);
  }
  const deleteCategory = async() => {
    setIsOpen(false)
    try {
        const response = await axios.delete(`/api/categories/${category._id}`)
        console.log(response)
        toast.success("Category Deleted successfully")
        getCategories()
        
    } catch (error) {
        console.log(error.message)
        toast.error("Category not deleted! Try Again!")
    }
  }
  if (!isOpen) return null;

  return (
    <div className="absolute  inset-0 flex items-center justify-center z-50">
      <div className='bg-white border-2 border-gray-400 py-12 rounded-lg shadow-lg p-6' >
        <div className="flex flex-col gap-2 items-center justify-center flex-wrap">
        <p className="font-semibold text-xl">Are you sure you want to delete &nbsp;"{category?.name}"?</p>
        
        <div className="flex flex-row gap-4">
          <button onClick={cancelDelete} className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white">Cancel</button>
          <button onClick={deleteCategory} className="bg-blue-900 p-2 px-4 flex flex-row gap-1 rounded-xl text-white">Yes</button>
        </div>
      </div> 
      </div>
    </div>
  );
};

export default Modal;
