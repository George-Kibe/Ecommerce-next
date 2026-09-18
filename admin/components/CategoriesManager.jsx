"use client"

import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/DeleteModal'

/**
 * Category CRUD. The list is rendered on the server and passed in; after a
 * mutation we call router.refresh() instead of re-fetching from the client.
 */
export default function CategoriesManager({ categories }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [parentCategory, setParentCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [properties, setProperties] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const resetForm = () => {
    setEditingCategory(null)
    setName("")
    setProperties([])
    setParentCategory("")
  }

  const initiateDelete = (category) => {
    setCategoryToDelete(category)
    setIsOpen(true)
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Cannot save an empty category")
      return
    }
    if (isSaving) return
    setIsSaving(true)

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(",").map((v) => v.trim()).filter(Boolean),
      })),
    }

    try {
      if (editingCategory) {
        await axios.put("/api/categories", { ...data, _id: editingCategory._id })
        toast.success("Category edited successfully")
      } else {
        await axios.post("/api/categories", data)
        toast.success("Category added successfully")
      }
      resetForm()
      router.refresh()
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Could not save the category")
    } finally {
      setIsSaving(false)
    }
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setName(category.name)
    setParentCategory(category.parentCategory?._id ?? "")
    setProperties(
      (category.properties ?? []).map(({ name, values }) => ({
        name,
        values: (values ?? []).join(","),
      }))
    )
  }

  const addProperty = () => setProperties((prev) => [...prev, { name: "", values: "" }])

  const handlePropertyNameChange = (index, newName) => {
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, name: newName } : p)))
  }
  const handlePropertyValuesChange = (index, newValues) => {
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, values: newValues } : p)))
  }
  const removeProperty = (index) => {
    setProperties((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='w-full h-full text-blue-900 py-4 overflow-y-auto'>
      <Modal
        setIsOpen={setIsOpen}
        categoryToDelete={categoryToDelete}
        isOpen={isOpen}
        onDeleted={() => router.refresh()}
      />

      <h1 className="mb-2 font-semibold text-xl">All Categories</h1>
      <label>
        {editingCategory ? `Edit Category - ${editingCategory.name}` : "Add a new Category"}
      </label>

      <form onSubmit={saveCategory} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input type="text" placeholder='Category Name'
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            className="border-2 border-gray-300 mb-2 rounded-md p-1 focus:border-blue-900" />
          <select value={parentCategory} onChange={(ev) => setParentCategory(ev.target.value)}
            className='border-2 border-gray-300 rounded-md mb-2 p-1 focus:border-blue-900'>
            <option value="">No Parent Category</option>
            {categories
              .filter((c) => c._id !== editingCategory?._id)
              .map((category) => (
                <option value={category._id} key={category._id}>{category.name}</option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className='block mb-2 font-semibold'>Properties</label>
          <button onClick={addProperty} type="button" className="block bg-gray-600 p-2 mb-2 rounded-md text-white text-sm">
            Add new Property
          </button>
          {properties.map((property, index) => (
            <div className="flex gap-1 mb-1" key={index}>
              <input type="text" value={property.name}
                onChange={(e) => handlePropertyNameChange(index, e.target.value)}
                placeholder='property name eg. Color' className="border p-1" />
              <input type="text" value={property.values}
                onChange={(e) => handlePropertyValuesChange(index, e.target.value)}
                placeholder='values, comma separated' className="border p-1" />
              <button onClick={() => removeProperty(index)} type="button" className="block bg-gray-600 p-2 rounded-md text-white text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {editingCategory && (
            <button onClick={resetForm} type="button" className="block bg-gray-600 p-2 rounded-md text-white text-sm">
              Cancel
            </button>
          )}
          <button type='submit' disabled={isSaving}
            className="self-start p-2 px-4 bg-blue-900 text-white rounded-md disabled:opacity-50">
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {!editingCategory && (
        <div className="mt-4 w-full overflow-x-auto rounded-md bg-white">
        <table className="border border-gray-400 p-2 w-full min-w-[36rem] bg-white">
          <thead className="bg-blue-100 p-2">
            <tr className="border border-gray-400">
              <th className="border border-gray-400 p-1 text-left">#</th>
              <th className="border border-gray-400 p-1 text-left">Category Name</th>
              <th className="border border-gray-400 p-1 text-left">Parent Category</th>
              <th className="border border-gray-400 p-1 text-left">Created</th>
              <th className="border border-gray-400 p-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="border border-gray-400 p-1">
            {categories.map((category, index) => (
              <tr className="border border-gray-400 p-1" key={category._id}>
                <td className="border border-gray-400 p-1">{index + 1}</td>
                <td className="border border-gray-400 p-1">{category.name}</td>
                <td className="border border-gray-400 p-1">{category.parentCategory?.name || ""}</td>
                <td className="border border-gray-400 p-1">・{moment(category.createdAt).calendar()}</td>
                <td className="border border-gray-400">
                  <div className="flex flex-row p-1 pl-2">
                    <button onClick={() => editCategory(category)}
                      className='bg-blue-900 p-2 mr-2 flex flex-row gap-1 text-white rounded-xl'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => initiateDelete(category)} className="bg-red-700 p-2 flex flex-row gap-1 rounded-xl text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
