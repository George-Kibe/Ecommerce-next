"use client"

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, categoryToDelete: category, setIsOpen, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/categories/${category._id}`);
      toast.success("Category deleted successfully");
      setIsOpen(false);
      onDeleted?.();
    } catch (error) {
      // The API refuses to delete a category that still has products or
      // subcategories, and explains which — surface that to the user.
      toast.error(error.response?.data?.error ?? "Category not deleted. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className='bg-white border-2 border-gray-400 py-12 rounded-lg shadow-lg p-6'>
        <div className="flex flex-col gap-2 items-center justify-center flex-wrap">
          <p className="font-semibold text-xl">
            Are you sure you want to delete &quot;{category?.name}&quot;?
          </p>

          <div className="flex flex-row gap-4">
            <button
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
              className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={deleteCategory}
              disabled={isDeleting}
              className="bg-blue-900 p-2 px-4 flex flex-row gap-1 rounded-xl text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
