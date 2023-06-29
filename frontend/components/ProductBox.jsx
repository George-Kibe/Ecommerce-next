"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "@/context/CartContext";
import Image from "next/image";
import StarIcon from "./icons/StarIcon";


export default function ProductBox({_id,title,price,images, product}) {
  const {addProduct, cartProducts} = useContext(CartContext);
  const url = '/products/'+_id;
  const handleAddToCart = (product) => {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    existingProduct && toast.success("Item Already in cart. Quantity added by one")
    addProduct(product)
  }
  return (
    <div className="flex flex-col items-center justify-center w-[45vw] h-[30vh] sm:w-[30vw] md:w-[300px]
      max-w-sm bg-white border border-gray-200 rounded-lg shadow
      dark:bg-gray-800 dark:border-gray-700">
      <ToastContainer />
      <Link href={url} className="flex rounded-md w-[30vw] h-[30vh] md:w-[300px] md:h-[300px] relative">
        <Image
          fill
          src={images?.[0]} 
          className="object-fit rounded-md"
          alt={title}
        />
      </Link>
      <div className="px-5 pb-5">
        <Link href={url}>
          <h5 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </Link>
        <div className="flex items-center mt-2.5 mb-5">
          <StarIcon />
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <span className="text-nm font-bold text-gray-900 dark:text-white">Kshs.&nbsp;{price}</span>
          <button onClick={() => handleAddToCart(product)}
            className="text-white items-center flex ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <CartIcon className='w-4 h-4 mr-1' />
            Add&nbsp;to&nbsp;cart
          </button>
        </div>
      </div>
    </div>
  );
}