"use client"
import { toast } from 'react-toastify';
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";

/**
 * Product card.
 *
 * The previous version sized the card in viewport units (`w-[45vw] h-[30vh]`)
 * and then gave the image a *different* set (`w-[30vw] h-[30vh]`), so the image
 * was as tall as the whole card and the title, price and button overflowed out
 * of it. It also used `object-cover`, which crops product photos.
 *
 * Now: the grid owns the width, the image sits in a fixed square so every card
 * lines up, and `object-contain` shows the whole product uncropped — which is
 * what these white-background catalogue shots need.
 */
export default function ProductBox({ _id, title, price, images, product }) {
  const { addProduct, cartProducts } = useContext(CartContext);
  const url = '/products/' + _id;

  const handleAddToCart = (product) => {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    existingProduct && toast.success("Item already in cart — quantity increased")
    addProduct(product)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={url} className="relative block aspect-square w-full bg-white">
        {/* next/image throws when src is undefined, so a product with no
            images has to render a placeholder instead. */}
        {images?.[0] ? (
          <Image
            fill
            src={images[0]}
            // Matches the grid: 2 columns on mobile, 3 at md, 4 at lg.
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3"
            alt={title}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            No image
          </span>
        )}
      </Link>

      {/* mt-auto on the footer row pins price/button to the bottom so cards with
          shorter titles still align across the row. */}
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link href={url} className="hover:underline">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
            {title}
          </h3>
        </Link>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-base font-bold whitespace-nowrap text-gray-900">
            Kshs.&nbsp;{price}
          </span>
          <button
            type="button"
            onClick={() => handleAddToCart(product)}
            aria-label={`Add ${title} to cart`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto"
          >
            <CartIcon className="mr-1 h-4 w-4" />
            Add&nbsp;to&nbsp;cart
          </button>
        </div>
      </div>
    </div>
  );
}
