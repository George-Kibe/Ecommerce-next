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

          {/*
            The roles were inverted: Cancel was red and the destructive "Yes"
            was the prominent brand-blue primary. Someone reading red as
            "danger" would reach for the blue button and delete the category.
            Per the HIG, the destructive action takes the red destructive style
            and an explicit verb, and Cancel is the neutral, safe choice.
          */}
          <div className="flex flex-row flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
              className="min-h-11 rounded-xl border-2 border-gray-400 bg-white px-5 font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={deleteCategory}
              disabled={isDeleting}
              className="min-h-11 rounded-xl bg-red-700 px-5 font-medium text-white hover:bg-red-800 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
