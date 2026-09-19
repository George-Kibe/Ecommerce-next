"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { buttonClass } from "@/components/ui"

/*
  Confirmation dialog for deleting a category.

  Was absolutely positioned inside the page with no backdrop and no keyboard
  support. Now a fixed, modal dialog: backdrop, Escape to cancel, and focus
  starts on Cancel (the safe choice — HIG: don't make the destructive button
  the default).
*/
const Modal = ({ isOpen, categoryToDelete: category, setIsOpen, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    cancelRef.current?.focus()
    const onKey = (e) => e.key === "Escape" && setIsOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen, setIsOpen])

  const deleteCategory = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/categories/${category._id}`)
      toast.success("Category deleted")
      setIsOpen(false)
      onDeleted?.()
    } catch (error) {
      // The API refuses to delete a category that still has products or
      // subcategories, and explains which — surface that to the user.
      toast.error(error.response?.data?.error ?? "Category not deleted. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Cancel" onClick={() => setIsOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50" />
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-category-title"
        className="relative w-full max-w-md rounded-xl border border-line bg-surface p-6 text-center shadow-xl">
        <h2 id="delete-category-title" className="mb-2 text-xl font-semibold text-fg">
          Delete &quot;{category?.name}&quot;?
        </h2>
        <p className="mb-6 text-fg-muted">This can&apos;t be undone.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button ref={cancelRef} type="button" onClick={() => setIsOpen(false)} disabled={isDeleting} className={buttonClass.secondary}>
            Cancel
          </button>
          <button type="button" onClick={deleteCategory} disabled={isDeleting} className={buttonClass.danger}>
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
