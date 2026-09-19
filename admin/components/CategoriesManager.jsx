"use client"

import { useId, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Modal from "@/components/DeleteModal"
import { Card, EmptyState, PageHeader, TableShell, buttonClass, inputClass, labelClass } from "@/components/ui"
import { formatDate } from "@/lib/formatDate"

/**
 * Category CRUD. The list is rendered on the server and passed in; after a
 * mutation we call router.refresh() instead of re-fetching from the client.
 */
export default function CategoriesManager({ categories }) {
  const router = useRouter()
  const uid = useId()
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

  const saveCategory = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please give the category a name")
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
        toast.success("Category updated")
      } else {
        await axios.post("/api/categories", data)
        toast.success("Category added")
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
      (category.properties ?? []).map(({ name, values }) => ({ name, values: (values ?? []).join(", ") }))
    )
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const updateProperty = (index, field, value) =>
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))

  const f = (name) => `${uid}-${name}`

  return (
    <div className="mx-auto max-w-5xl">
      <Modal
        setIsOpen={setIsOpen}
        categoryToDelete={categoryToDelete}
        isOpen={isOpen}
        onDeleted={() => router.refresh()}
      />

      <PageHeader title="Categories" description="Group products and define the properties they share." />

      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-fg">
          {editingCategory ? `Edit “${editingCategory.name}”` : "Add a category"}
        </h2>

        <form onSubmit={saveCategory} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={f("name")} className={labelClass}>Name</label>
              <input id={f("name")} type="text" required value={name}
                onChange={(ev) => setName(ev.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor={f("parent")} className={labelClass}>Parent category</label>
              <select id={f("parent")} value={parentCategory}
                onChange={(ev) => setParentCategory(ev.target.value)} className={inputClass}>
                <option value="">None</option>
                {categories
                  .filter((c) => c._id !== editingCategory?._id)
                  .map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 font-semibold text-fg">Properties</legend>
            {properties.length === 0 && (
              <p className="mb-2 text-sm text-fg-muted">e.g. Color with values “Black, White”.</p>
            )}
            <div className="space-y-2">
              {properties.map((property, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                  <div className="min-w-0 flex-1">
                    <label htmlFor={f(`pname-${index}`)} className="sr-only">Property {index + 1} name</label>
                    <input id={f(`pname-${index}`)} type="text" value={property.name} placeholder="Property (e.g. Color)"
                      onChange={(e) => updateProperty(index, "name", e.target.value)} className={inputClass} />
                  </div>
                  <div className="min-w-0 flex-2">
                    <label htmlFor={f(`pvals-${index}`)} className="sr-only">Property {index + 1} values, comma separated</label>
                    <input id={f(`pvals-${index}`)} type="text" value={property.values} placeholder="Values, comma separated"
                      onChange={(e) => updateProperty(index, "values", e.target.value)} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => setProperties((prev) => prev.filter((_, i) => i !== index))}
                    aria-label={`Remove property ${property.name || index + 1}`} className={buttonClass.secondary}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setProperties((prev) => [...prev, { name: "", values: "" }])}
              className={`${buttonClass.secondary} mt-3`}>
              Add property
            </button>
          </fieldset>

          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
            {editingCategory && (
              <button type="button" onClick={resetForm} className={buttonClass.secondary}>Cancel</button>
            )}
            <button type="submit" disabled={isSaving} className={buttonClass.primary}>
              {isSaving ? "Saving…" : editingCategory ? "Save changes" : "Add category"}
            </button>
          </div>
        </form>
      </Card>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet">Add one above to start organising products.</EmptyState>
      ) : (
        <TableShell minWidth="40rem">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Properties</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-hover">
                <td className="font-medium text-fg">{category.name}</td>
                <td className="text-fg-muted">{category.parentCategory?.name || "—"}</td>
                <td className="text-fg-muted">
                  {(category.properties ?? []).map((p) => p.name).filter(Boolean).join(", ") || "—"}
                </td>
                <td className="whitespace-nowrap text-fg-muted">{formatDate(category.createdAt)}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => editCategory(category)} className={buttonClass.secondary}
                      aria-label={`Edit ${category.name}`}>
                      Edit
                    </button>
                    <button type="button"
                      onClick={() => { setCategoryToDelete(category); setIsOpen(true) }}
                      className={buttonClass.danger} aria-label={`Delete ${category.name}`}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  )
}
