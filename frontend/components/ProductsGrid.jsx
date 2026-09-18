"use client"
import ProductBox from "@/components/ProductBox";

/**
 * Responsive product grid.
 *
 * Was a flex-wrap row of cards sized in viewport units (`w-[45vw]`), which made
 * card width track the window rather than the column count — so cards changed
 * size continuously and never lined up. A real grid gives fixed column counts
 * per breakpoint and equal-height cells.
 */
export default function ProductsGrid({ products }) {
  if (!products?.length) return null;

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {products.map((product) => (
        <ProductBox key={product._id} product={product} {...product} />
      ))}
    </div>
  );
}
