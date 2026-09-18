import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Product from "@/models/Product";
import connect from "@/lib/db";
import DetailedProduct from "@/components/DetailedProduct";

const getProduct = async (id) => {
  // An arbitrary string would make findById throw a CastError and surface as a
  // 500; an unknown product should be a 404.
  if (!mongoose.isValidObjectId(id)) return null;
  await connect();
  const response = await Product.findById(id);
  return response ? JSON.parse(JSON.stringify(response)) : null;
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    // Next 16.3.5 returns 200 rather than 404 for notFound() in a route nested
    // two or more segments deep, so this would otherwise be a soft 404 that
    // search engines index as a real page. noindex is the mitigation until the
    // framework returns the right status.
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return <DetailedProduct product={product} />;
}
