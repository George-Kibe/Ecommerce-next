"use client"
import { toast } from 'react-toastify';
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import Link from 'next/link';

/**
 * Homepage hero.
 *
 * The image box was `sm:w-[600px]` inside a `md:w-1/2` parent, so between the
 * `sm` and `md` breakpoints it tried to be wider than its container and pushed
 * the layout out. Its height was also `40vh`, which on a short window collapsed
 * the product to a sliver. It now uses a fixed aspect ratio that scales with
 * the column, and the copy is left-aligned — `text-justify` on short lines
 * produced large uneven word gaps.
 */
export default function Featured({ product }) {
  const { addProduct, cartProducts } = useContext(CartContext);

  function addFeaturedToCart() {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    existingProduct && toast.success("Item already in cart — quantity increased")
    addProduct(product)
  }

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
      {/* Image first on mobile, second on desktop — the product should lead on
          a narrow screen rather than being pushed below the copy. */}
      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg image-tile">
          {product.images?.[0] && (
            <Image
              fill
              src={product.images[0]}
              alt={product.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain p-4"
            />
          )}
        </div>
      </div>

      <div className="order-2 md:order-1">
        <h1 className="mb-2 text-2xl font-semibold text-fg md:mb-4 md:text-4xl">
          {product.title}
        </h1>
        <p className="text-fg-muted md:text-lg">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-3 md:mt-6">
          <Link
            href={`/products/${product._id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-link px-5 text-sm font-medium text-link hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            Read more
          </Link>
          <button
            onClick={addFeaturedToCart}
            type="button"
            aria-label={`Add ${product.title} to cart`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-on-accent hover:bg-accent-hover"
          >
            <svg aria-hidden="true" className="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            Add&nbsp;to&nbsp;cart
          </button>
        </div>
      </div>
    </section>
  );
}
