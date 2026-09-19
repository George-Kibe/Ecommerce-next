"use client"
import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { ReactSortable } from "react-sortablejs"
import uploadImageToS3 from "@/lib/uploadImageToS3"
import ProductImage from "@/components/ProductImage"
import { Card, PageHeader, buttonClass, inputClass, labelClass } from "@/components/ui"

const ACCEPTED = "image/png,image/jpeg,image/webp,image/avif"

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const ProductForm = ({
  _id: id, title: existingTitle, description: existingDescription, price: existingPrice,
  images: existingImages, category: existingCategory, properties: existingProperties,
  categories = [],
}) => {
  const router = useRouter()
  const uid = useId()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || "")
  const [productProperties, setProductProperties] = useState(existingProperties || {})
  const [price, setPrice] = useState(existingPrice ?? "")
  const [category, setCategory] = useState(existingCategory || "")
  // react-sortablejs needs objects with an `id`: it writes drag state onto each
  // item, which fails on the plain URL strings this used to pass it.
  const [images, setImages] = useState((existingImages || []).map((url) => ({ id: url })))
  const [uploadingCount, setUploadingCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const uploadImages = async (event) => {
    const input = event.target
    const files = Array.from(input.files ?? [])
    if (!files.length) return

    // Upload in parallel with a placeholder tile per file, instead of one at a
    // time behind a single spinner.
    setUploadingCount((n) => n + files.length)
    const results = await Promise.allSettled(
      files.map((file) => uploadImageToS3(file).finally(() => setUploadingCount((n) => n - 1)))
    )

    const uploaded = []
    results.forEach((result, i) => {
      if (result.status === "fulfilled") uploaded.push({ id: result.value })
      else toast.error(`${files[i].name}: ${result.reason?.message ?? "upload failed"}`)
    })
    if (uploaded.length) {
      setImages((prev) => [...prev, ...uploaded])
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`)
    }
    // Allow re-selecting the same file after a failed attempt.
    input.value = ""
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    // Say *what* is missing rather than a generic error. Category is optional:
    // the API accepts uncategorised products, and the select offers that
    // option — requiring it here contradicted the form.
    const missing = [
      !title.trim() && "name",
      !description.trim() && "description",
      (price === "" || Number(price) < 0) && "a valid price",
      !images.length && "at least one photo",
    ].filter(Boolean)
    if (missing.length) {
      toast.error(`Please add ${missing.join(", ")}.`)
      return
    }
    if (isSaving) return
    setIsSaving(true)

    const data = {
      title, description, price, category,
      images: images.map((img) => img.id),
      properties: productProperties,
    }
    try {
      if (isEdit) await axios.put("/api/products", { ...data, _id: id })
      else await axios.post("/api/products", data)
      toast.success(isEdit ? "Product updated" : "Product added")
      router.push("/products")
      router.refresh()
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Could not save the product. Please try again.")
      setIsSaving(false)
    }
  }

  // Properties come from the chosen category and its ancestors. Guard every
  // lookup: a category can be deleted while this form is open.
  const propertiesToFill = []
  if (categories.length && category) {
    let catInfo = categories.find(({ _id }) => _id === category)
    const seen = new Set()
    while (catInfo && !seen.has(catInfo._id)) {
      seen.add(catInfo._id)
      propertiesToFill.push(...(catInfo.properties ?? []))
      const parentId = catInfo.parentCategory?._id
      catInfo = parentId ? categories.find(({ _id }) => _id === parentId) : null
    }
  }

  const f = (name) => `${uid}-${name}`

  return (
    <form onSubmit={saveProduct} className="mx-auto max-w-3xl" noValidate>
      <PageHeader
        title={isEdit ? "Edit product" : "New product"}
        description={isEdit ? existingTitle : "Add a product to the storefront."}
      />

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={f("title")} className={labelClass}>Name</label>
            <input id={f("title")} type="text" required value={title}
              onChange={(ev) => setTitle(ev.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor={f("category")} className={labelClass}>Category</label>
            <select id={f("category")} value={category}
              onChange={(ev) => setCategory(ev.target.value)} className={inputClass}>
              <option value="">Not categorised</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor={f("price")} className={labelClass}>Price (Kshs)</label>
            <input id={f("price")} type="number" inputMode="decimal" min="0" step="any" required
              value={price} onChange={(ev) => setPrice(ev.target.value)} className={inputClass} />
          </div>

          {propertiesToFill.map((p) => (
            <div key={p.name}>
              <label htmlFor={f(`prop-${p.name}`)} className={labelClass}>{p.name}</label>
              <select id={f(`prop-${p.name}`)} value={productProperties[p.name] ?? ""}
                onChange={(ev) => setProductProperties((prev) => ({ ...prev, [p.name]: ev.target.value }))}
                className={inputClass}>
                <option value="">—</option>
                {(p.values ?? []).map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor={f("description")} className={labelClass}>Description</label>
            <textarea id={f("description")} rows={5} required value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              className={`${inputClass} py-2`} />
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-fg">Photos</h2>
        <p className="mb-4 text-sm text-fg-muted">
          PNG, JPEG, WebP or AVIF up to 5 MB. Drag to reorder — the first photo is the main one.
        </p>

        <div className="flex flex-wrap gap-3">
          <ReactSortable list={images} setList={setImages} className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={image.id} className="relative h-32 w-32 cursor-grab overflow-hidden rounded-lg border border-line active:cursor-grabbing">
                <ProductImage src={image.id} alt="" sizes="128px" padding="p-1" />
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-xs font-semibold text-on-accent">Main</span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((img) => img.id !== image.id))}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute bottom-1 right-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface text-danger shadow hover:bg-hover"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </ReactSortable>

          {Array.from({ length: uploadingCount }, (_, i) => (
            <div key={`uploading-${i}`} role="status"
              className="flex h-32 w-32 animate-pulse flex-col items-center justify-center rounded-lg border border-dashed border-field-line bg-line/50 text-xs text-fg-muted">
              Uploading…
            </div>
          ))}

          {/* The file input is visually hidden (not display:none), so it stays
              reachable by keyboard; the label shows its focus ring. */}
          <label className="relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-field-line text-sm font-medium text-fg-muted hover:border-link hover:text-link has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
            <UploadIcon />
            Add photos
            <input type="file" multiple accept={ACCEPTED} onChange={uploadImages} className="sr-only" />
          </label>
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => router.back()} className={buttonClass.secondary}>
          Cancel
        </button>
        <button type="submit" disabled={isSaving || uploadingCount > 0} className={buttonClass.primary}>
          {isSaving ? "Saving…" : uploadingCount > 0 ? "Waiting for uploads…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
