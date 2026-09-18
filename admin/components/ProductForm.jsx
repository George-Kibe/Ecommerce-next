"use client"
import uploadImageToS3 from '@/lib/uploadImageToS3';
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Image from "next/image"
import { FadeLoader } from 'react-spinners';
import { ReactSortable } from 'react-sortablejs';

const ProductForm = ({_id:id, title:existingTitle, description:existingDescription,
  price:existingPrice, images:existingImages, category:existingCategory,
  properties:existingProperties, categories = []}) => {

  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || '')
  const [productProperties, setProductProperties] = useState(existingProperties || {})
  const [price, setPrice] = useState(existingPrice || '')
  const [images, setImages] = useState(existingImages ||[])
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // Categories are loaded on the server and passed in, rather than fetched
  // from the client after mount.
  const [category, setCategory] = useState(existingCategory|| "")

  const router = useRouter();
  const pathname = usePathname()

  const goBack = () => {
    router.back()
    // router.push("/products")
  }

  const uploadImages = async(event) => {
    const files = Array.from(event.target?.files ?? []);
    const uploadedFiles = [];
    if(files.length < 1){
      toast.error("You have no image(s)")
      return
    }
    setIsUploading(true)
    toast.info("Uploading your Image(s)")
    try {
      for (const file of files) {
        try {
          // The server validates type and size again before presigning.
          uploadedFiles.push(await uploadImageToS3(file));
        } catch (error) {
          toast.error(`${file.name}: ${error.message}`)
        }
      }
      if (uploadedFiles.length > 0) {
        setImages(prev => (prev ? [...prev, ...uploadedFiles] : [...uploadedFiles]));
        toast.success("Image(s) uploaded successfully")
      }
    } finally {
      setIsUploading(false)
      // Allow re-selecting the same file after a failed attempt.
      event.target.value = ""
    }
  }
  
  const editProductProperties = (propName, value) => {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps
    })
  }

  const saveProduct = async(e) => {
    e.preventDefault()
    // These were `|` (bitwise) rather than `||`, so the guard only ever saw
    // the numeric coercion of the last operand.
    if(!title || !description || !price || !images.length || !category){
      toast.error("You have missing details!");
      return
    }
    if (isSaving) return
    setIsSaving(true)

    const data = {title, description, price, images, category, properties:productProperties}
    try {
      if(id){
        toast.info("Saving your changes")
        await axios.put("/api/products", {...data, _id:id})
        toast.success("Product edited successfully")
      } else {
        toast.info("Adding your Product to the database")
        await axios.post("/api/products", data)
        toast.success("Product added successfully")
      }
      router.push("/products")
      router.refresh()
    } catch (error) {
      const message = error.response?.data?.error ?? "Could not save the product. Try again."
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    // Guard every lookup: a category can be deleted while this form is open,
    // and a parent id can point at something no longer in the list.
    let catInfo = categories.find(({_id}) => _id === category);
    const seen = new Set();
    while (catInfo && !seen.has(catInfo._id)) {
      seen.add(catInfo._id);
      propertiesToFill.push(...(catInfo.properties ?? []));
      const parentId = catInfo.parentCategory?._id;
      catInfo = parentId ? categories.find(({_id}) => _id === parentId) : null;
    }
  }

  const updateImagesOrder = (images) => {
    setImages(images)
  }
  const deleteImage = (image) => {
    // console.log(image)
    // console.log(images)
    const otherImages = images.filter((img) => img !== image)
    setImages(otherImages)
  }
  
  return (
    <div className="w-full h-full text-black">
      <form onSubmit={saveProduct} className="flex flex-col p-4">
        <h1 className="mb-2 font-semibold text-xl">{pathname.includes("edit")?"Edit Product": "New Product"}</h1>
        <label>Product Name</label>
        <input type="text" placeholder='Product name' 
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            className="border-2 border-gray-300 rounded-md p-1 w-full mb-2 focus:border-blue-900  md:w-1/2 xl:w-1/3 " />
        <label>Product Category</label>
        <select value={category} onChange={ev => setCategory(ev.target.value)}
          className='border-2 border-gray-300 mb-2 p-1 md:w-1/2 xl:w-1/3 rounded-md px-1 w-full focus:border-blue-900"'>
          <option value="">Not Categorized</option>
          {
            categories.length > 0 && categories.map((category, index) => (
              <option className="p-1 bg-black text-white" value={category._id} key={index}>{category.name}</option>
            ))
          }
        </select>
        {
          propertiesToFill.length > 0 && propertiesToFill.map( (p, index) => (
            <div className="m-1 flex gap-1" key={index}>
              <div className="bg-emerald-700 p-1 rounded-lg text-white mr-2">{p.name}</div>
              <select value ={productProperties[p.name]}
                onChange={ev => editProductProperties(p.name, ev.target.value)}
              >
                {
                  p.values && p.values.map((value, index) => (
                    <option value={value} key={index} className="p-1 m-1">{value}</option>
                  ))
                }
              </select>
            </div>
          ))
        }
        <label>Product Description</label>
        <textarea name="" id="" cols="30" rows="5" 
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder='Product Description'
            className="border-2 border-gray-300 rounded-md p-1 w-full mb-2 focus:border-blue-900">
        </textarea>
        <label >Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable className='flex flex-wrap gap-2' list={images} setList={updateImagesOrder}>         
            {
              images.length > 0 && images.map(image => (
                <div className="w-48 h-48 border border-blue-900 rounded-lg relative" key={image}>
                  {/* alt was the image URL, which VoiceOver reads out in full.
                      These thumbnails sit next to a labelled remove button, so
                      they're decorative. */}
                  <Image src={image.toString()} fill sizes="192px" alt="" className='rounded-md object-cover' />
                  <button type="button" onClick={() => deleteImage(image)}
                    aria-label="Remove this image"
                    className="absolute rounded-full min-w-11 min-h-11 inline-flex items-center justify-center bg-white border-2 border-black text-red-600 bottom-1 right-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ) )           
            }
          </ReactSortable>
          {
            isUploading && <div className="h-48 w-32 flex border-2 border-blue-900 items-center justify-center rounded-lg"><FadeLoader /></div>
          }
          <label className="w-48 h-48 cursor-pointer bg-gray-200 border-2 border-blue-900 rounded-lg text-center flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Upload
            <input type="file" multiple onChange={uploadImages} className='hidden' />
          </label>
        </div>
        {
          !images?.length && (
            <div className="">No Images for This Product</div>
          )
        }
        <label>Price (in Kshs)</label>
        <input type="number" placeholder='Price' 
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            className="border-2 border-gray-300 rounded-md p-1 self-start mb-2 focus:border-blue-900" />
        
        <div className="flex flex-row gap-4">
          <button type='submit' disabled={isSaving || isUploading}
            className='bg-blue-900 text-white p-2 rounded-xl self-start disabled:opacity-50'>
            {isSaving ? "Saving…" : pathname.includes("edit") ? "Edit Product" : "Add Product"}
          </button>
          <button onClick={goBack} type='button' className='bg-gray-500  text-white p-2 px-4 rounded-xl self-start'>
            Cancel
          </button>
        </div>        
        </form>   
    </div>
  )
}

export default ProductForm