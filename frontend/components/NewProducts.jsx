"use client"

import ProductsGrid from "@/components/ProductsGrid";

export default function NewProducts({products}) {
  return (
    <div className="p-2 md:p-4 lg:p-8 flex flex-col items-center justify-center">
      <h2 className="text-semibold text-[24px] md:text-[30px] mb-2 md:mb-4">New Arrivals</h2>
      <ProductsGrid products={products} />
    </div>
  );
}