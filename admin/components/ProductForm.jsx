"use client"
import uploadImageToS3 from '@/lib/uploadImageToS3';
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image"
import { FadeLoader } from 'react-spinners';
import { ReactSortable } from 'react-sortablejs';

const ProductForm = ({_id:id, title:existingTitle, description:existingDescription, 
  price:existingPrice, images:existingImages, category:existingCategory, properties:existingProperties}) => {
    
  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || '')
  const [productProperties, setProductProperties] = useState(existingProperties || {})
  const [price, setPrice] = useState(existingPrice || '')
  const [images, setImages] = useState(existingImages ||[])
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(existingCategory|| "")

  const getCategories = async() => {
    try {
      const response = await axios.get("/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])

  const router = useRouter();
  const pathname = usePathname()
  const uploadImages = async(event) => {
    const files = event.target?.files;
    const uploadedFiles = [];
    if(files.length < 1){
      toast.error("You have no image(s)")
      return
    }
    setIsUploading(true)
    toast.info("Uploading your Image(s)")
    for (let i = 0; i < files.length; i++) {
      try {
        const parts = files[i].name.split(".")
        const ext = parts[parts.length-1];
        if(ext !=="png" && ext!=="jpg" && ext !=="jpeg"){
          toast.error(`Error Uploading ${ext} Images format. Not recognized.`)
          setIsUploading(false)
          return
        }
        const uploadUrl = await uploadImageToS3(files[i], ext);
        // console.log('Image URL:', uploadUrl);
        uploadedFiles.push(uploadUrl)
      } catch (error) {
        toast.error("Error Uploading one of the Images")
        setIsUploading(false)
        return
      }      
    }
    // console.log("Uploaded Files: ",uploadedFiles)
    setImages(prev => {
      console.log(prev)
      return prev? [...prev, ...uploadedFiles] : [...uploadedFiles]
    }); 
    toast.success("Image(s) uploaded successfully")
    setIsUploading(false)
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
    if(!title| !description |!price |!images.length |!category){
      toast.error("You have missing details!");
      return
    }
    const data = {title, description, price, images, category, properties:productProperties}
    if(id){
      toast.info("Editing your Product in the Database")
      try {
        const response = await axios.put("/api/products/", {...data, _id:id})
        // console.log(response)
        if(response.status === 200){
            toast.success("Product edited successfully")
            setTimeout(router.push("/products"), 8000); 
            
        }else{
            toast.error("Product not Edited. Try again!")
        }
      } catch (error) {
        
      }
    }else{
      toast.info("Adding your Product to Database")
      try {
        const response = await axios.post("/api/products/", data)
        console.log(response)
        if(response.status === 201){
            toast.success("Product added successfully to database")
            setTimeout(router.push("/products"), 8000); 
            
        }else{
            toast.error("Product not added to database. Try again!")
        }
      } catch (error) {
        
      }
    }
  }

  const propertiesToFill = []
  if(categories.length > 0 && category){
    let catInfo = categories.find(({_id}) => _id === category)
    propertiesToFill.push(...catInfo.properties)
    while(catInfo?.parentCategory?._id){
      const parentCat = categories.find(({_id}) => _id= catInfo.parentCategory._id)
      propertiesToFill.push(...parentCat.properties);
      catInfo=parentCat
    }     
  }
  
  return (
    <div className="w-full h-full text-black">
      <ToastContainer />
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
          {/* <ReactSortable className='flex flex-wrap gap-2' list={images} setList={updateImagesOrder}>          */}
            {
              images.length > 0 && images.map(image => (
                <div className="w-48 h-48 border border-blue-900 rounded-lg relative" key={image}>
                  <Image src={image} fill alt={image} className='rounded-md object-cover' />
                </div>
              ) )           
            }
          {/* </ReactSortable> */}
          {
            isUploading && <div className="h-48 w-32 flex border-2 border-blue-900 items-center justify-center rounded-lg"><FadeLoader /></div>
          }
          <label className="w-48 h-48 cursor-pointer bg-gray-200 border-2 border-blue-900 rounded-lg text-center flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
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
        <button type='submit' className='bg-blue-900 text-white p-2 rounded-xl self-start'>
          {pathname.includes("edit")?"Edit Product": "Add Product"}
        </button>
        </form>   
    </div>
  )
}

export default ProductForm