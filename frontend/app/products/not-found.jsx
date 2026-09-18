import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="mb-2 text-3xl font-bold text-fg md:text-4xl">Product not found</h1>
      <p className="mb-6 text-fg-muted">
        This product may have been removed or the link is incorrect.
      </p>
      <Link
        href="/products"
        className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-on-accent hover:bg-accent-hover"
      >
        Browse all products
      </Link>
    </div>
  );
}
