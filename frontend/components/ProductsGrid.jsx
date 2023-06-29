"use client"
import ProductBox from "@/components/ProductBox";

export default function ProductsGrid({products}) {
  return (
    <div className="flex flex-row flex-wrap gap-y-4 gap-x-2 md:gap-4 lg:gap-8">
      {products?.length > 0 && products.map(product => (
        <ProductBox key={product._id} product={product} {...product} />
      ))}
    </div>
  );
}