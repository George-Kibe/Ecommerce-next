"use client"

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function DeleteProductConfirm({ product }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteProduct = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/products/${product._id}`)
      toast.success("Deleted successfully")
      router.push("/products")
      router.refresh()
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Could not delete the product")
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2 items-center justify-center flex-wrap">
        <p className="font-semibold text-xl">
          Are you sure you want to delete &quot;{product.title}&quot;?
        </p>

        {/* Roles were inverted (red Cancel, blue "Yes"). The destructive action
            is now red with an explicit verb; Cancel is neutral. See the HIG
            guidance on destructive button roles. */}
        <div className="flex flex-row flex-wrap justify-center gap-4">
          <button
            onClick={() => router.back()}
            disabled={isDeleting}
            className="min-h-11 rounded-xl border-2 border-gray-400 bg-white px-5 font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={deleteProduct}
            disabled={isDeleting}
            className="min-h-11 rounded-xl bg-red-700 px-5 font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete product"}
          </button>
        </div>
      </div>
    </div>
  )
}
