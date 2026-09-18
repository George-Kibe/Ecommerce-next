"use client"
import React from 'react'
import Link from "next/link"
import { BRAND } from '@/lib/brand'

const Footer = () => {
  return (    
    <footer className="mt-4  md:mt-8 bottom-0 left-0 z-20 w-full p-4 text-white bg-black border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
        {/* The year was hardcoded to 2023 — it now tracks the render year. */}
        <span className="text-lg text-gray-300 sm:text-center">© {new Date().getFullYear()} <Link href="/" className="hover:underline">{BRAND.name}</Link>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-2 text-lg font-medium text-gray-400 sm:mt-0">
            <li>
                <Link href="/" className="mr-4 hover:underline md:mr-6">Home</Link>
            </li>
            <li>
                <Link href="/products" className="mr-4 hover:underline md:mr-6">All Products</Link>
            </li>
            <li>
                <Link href="/categories" className="mr-4 hover:underline md:mr-6">Categories</Link>
            </li>            
            <li>
                <Link href="/cart" className="hover:underline">Cart</Link>
            </li>
        </ul>
    </footer>

  )
}

export default Footer