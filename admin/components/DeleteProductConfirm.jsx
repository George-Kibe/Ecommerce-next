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

        <div className="flex flex-row gap-4">
          <button
            onClick={() => router.back()}
            disabled={isDeleting}
            className="bg-red-500 p-2 flex flex-row gap-1 rounded-xl text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={deleteProduct}
            disabled={isDeleting}
            className="bg-blue-900 p-2 px-4 flex flex-row gap-1 rounded-xl text-white disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  )
}
