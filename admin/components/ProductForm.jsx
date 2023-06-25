"use client"
import uploadImageToS3 from '@/lib/uploadImageToS3';
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = ({_id:id, title:existingTitle, description:existingDescription, price:existingPrice}) => {
  // console.log("ID: ", id)
  const [title, setTitle] = useState(existingTitle || "")
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [images, setImages] = useState([])

  const router = useRouter();
  const pathname = usePathname()
  const uploadImages = async(event) => {
    const files = event.target?.files;
    const uploadedFiles = [];
    if(files.length < 1){
      toast.error("You have no image(s)")
      return
    }
    toast.info("Uplading your Image(s)")
    for (let i = 0; i < files.length; i++) {
      try {
        const parts = files[i].name.split(".")
        const ext = parts[parts.length-1];
        if(ext !=="png" && ext!=="jpg" && ext !=="jpeg"){
          toast.error(`Error Uploading ${ext} Images format. Not recognized.`)
          return
        }
        const uploadUrl = await uploadImageToS3(files[i], ext);
        console.log('Image URL:', uploadUrl);
        uploadedFiles.push(uploadUrl)
      } catch (error) {
        toast.error("Error Uploading one of the Images")
      }      
    }
    // console.log("Uploaded Files: ",uploadedFiles)
    setImages(prev => {
      return prev? [...prev, ...uploadedFiles] : [...uploadedFiles]
    }); 
    toast.success("Image(s) uploaded successfully")
  }
  console.log("All images:", images)
  const saveProduct = async(e) => {
    e.preventDefault()
    if(!title| !description |!price){
      toast.error("You have missing details!");
      return
    }
    const data = {title, description, price}
    if(id){
      toast.info("Editing your Product in the Database")
      try {
        const response = await axios.put("/api/products/", {...data, _id:id})
        console.log(response)
        if(response.status === 200){
            toast.success("Product added successfully to database")
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
  
  return (
    <div className="w-full h-full">
      <ToastContainer />
      <form onSubmit={saveProduct} className="text-blue-900 flex flex-col p-4">
        <h1 className="mb-2 font-semibold text-xl">{pathname.includes("edit")?"Edit Product": "New Product"}</h1>
        <label>Product Name</label>
        <input type="text" placeholder='Product name' 
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900" />
        <label>Product Description</label>
        <textarea name="" id="" cols="30" rows="5" 
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder='Product Description'
            className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900">
        </textarea>
        <label >Photos</label>
        <div className="mb-2">
          <label className="w-24 h-24 cursor-pointer bg-gray-200 rounded-lg text-center flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Upload
            <input type="file" multiple onChange={uploadImages} className='hidden' />
          </label>
          {
            !images?.length && (
              <div className="">No Images in This Product</div>
            )
          }
        </div>
        <label>Price (in Kshs)</label>
        <input type="text" placeholder='Price' 
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            className="border-2 border-gray-300 rounded-md px-1 self-start mb-2 focus:border-blue-900" />
        <button type='submit' className='bg-blue-900 text-white p-2 rounded-xl self-start'>
          {pathname.includes("edit")?"Edit Product": "Add Product"}
        </button>
        </form>   
    </div>
  )
}

export default ProductForm