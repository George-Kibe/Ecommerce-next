"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const EditProductData = () => {
  const pathname = usePathname();
  const router = useRouter()
  console.log(pathname)

  return (
    <div>EditProductData</div>
  )
}

export default EditProductData