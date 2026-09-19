"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import ProductImage from "@/components/ProductImage"
import { Card, buttonClass } from "@/components/ui"

/*
  Destructive action styled per the HIG: the delete button is red with an
  explicit verb, Cancel is the neutral choice. The product's photo and name are
  shown so it's obvious *which* product is about to go.
*/
export default function DeleteProductConfirm({ product }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteProduct = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/products/${product._id}`)
      toast.success("Product deleted")
      router.push("/products")
      router.refresh()
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Could not delete the product")
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="text-center">
        <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg border border-line">
          <ProductImage src={product.images?.[0]} alt="" sizes="128px" padding="p-1" />
        </div>
        <h1 className="mb-1 text-xl font-semibold text-fg">Delete &quot;{product.title}&quot;?</h1>
        <p className="mb-6 text-fg-muted">
          This removes it from the store permanently. Existing orders keep their record of it.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => router.back()} disabled={isDeleting} className={buttonClass.secondary}>
            Cancel
          </button>
          <button type="button" onClick={deleteProduct} disabled={isDeleting} className={buttonClass.danger}>
            {isDeleting ? "Deleting…" : "Delete product"}
          </button>
        </div>
      </Card>
    </div>
  )
}
