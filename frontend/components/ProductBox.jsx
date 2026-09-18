"use client"
import { toast } from 'react-toastify';
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "@/context/CartContext";
import Image from "next/image";


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
      <Link href={url} className="flex rounded-md w-[30vw] h-[30vh] md:w-[300px] md:h-[300px] relative">
        {/* next/image throws when src is undefined, so a product with no
            images has to render a placeholder instead. */}
        {images?.[0] ? (
          <Image
            fill
            src={images[0]}
            sizes="(max-width: 768px) 45vw, 300px"
            className="object-cover rounded-md"
            alt={title}
          />
        ) : (
          <span className="flex w-full h-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
            No image
          </span>
        )}
      </Link>
      <div className="px-5 pb-5">
        <Link href={url}>
          <h5 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </Link>
        {/*
          A hardcoded "5.0" star rating used to render here for every product.
          No rating data exists, so it presented invented information as real —
          removed rather than shown until there are actual ratings to display.
        */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2.5">
          <span className="text-base font-bold text-gray-900 dark:text-white">Kshs.&nbsp;{price}</span>
          <button type="button" onClick={() => handleAddToCart(product)}
            aria-label={`Add ${title} to cart`}
            className="text-white items-center justify-center flex min-h-11 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <CartIcon className='w-4 h-4 mr-1' />
            Add&nbsp;to&nbsp;cart
          </button>
        </div>
      </div>
    </div>
  );
}