"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/context/CartContext";
import Image from "next/image";
import Link from 'next/link';

export default function Featured({product}) {
  const {addProduct, cartProducts} = useContext(CartContext);
  function addFeaturedToCart() {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    existingProduct && toast.success("Item Already in cart. Quantity added by one")
    addProduct(product)
  }

  return (
    <div className='flex p-4 md:flex-row flex-col-reverse items-center justify-center'>
      <div className="">
        <h1 className="text-semibold text-justify text-[24px] md:text-[30px] mb-2 md:mb-4">{product.title}</h1>
        {product.description}
        <div className="flex mt-2 md:mt-4">
          <Link href={`/products/${product._id}`} 
            className='text-blue-700 hover:text-white border border-blue-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:border-gray-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
            >Read more</Link>
          <button  onClick={addFeaturedToCart} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg aria-hidden="true" class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            Add&nbsp;to&nbsp;cart
          </button>
        </div>
      </div>
      <div className="w-full h-full">
        <div className="relative h-[200px] md:h-[500px] sm:h-[250px] sm:w-[600px] md:w-1/2 rounded-md">
          <Image fill src={product.images[0]} alt="Featured Product rounded-md"
            className="object-contain "
          />
        </div>
      </div>
    </div>
  );
}