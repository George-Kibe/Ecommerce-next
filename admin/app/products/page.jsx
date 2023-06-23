import Link from 'next/link'
import React from 'react'

const AllProducts = () => {
  return (
    <div className="text-blue-900 w-full flex justify-between p-4">
      <Link href={"/products/new"} className='bg-blue-900 text-white p-2 rounded-xl'>Add New Product</Link>
    </div>   
  )
}

export default AllProducts