import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-4xl font-bold mb-2">Product not found</h1>
      <p className="mb-6 text-gray-700">
        This product may have been removed or the link is incorrect.
      </p>
      <Link href="/products" className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
        Browse all products
      </Link>
    </div>
  );
}
