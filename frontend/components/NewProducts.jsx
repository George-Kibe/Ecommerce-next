"use client"

import ProductsGrid from "@/components/ProductsGrid";

export default function NewProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <h2 className="mb-4 text-center text-2xl font-semibold text-fg md:mb-6 md:text-3xl">
        New Arrivals
      </h2>
      <ProductsGrid products={products} />
    </section>
  );
}
