import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import connect from "@/lib/db";
import { BRAND, SITE_URL } from "@/lib/brand";

export const metadata = {
  title: "All Products",
  description: `Browse every product available at ${BRAND.name}, with fast, secure checkout.`,
  alternates: { canonical: "/products" },
  openGraph: {
    title: `All Products | ${BRAND.name}`,
    description: `Browse every product available at ${BRAND.name}.`,
    url: "/products",
  },
};

export const revalidate = 60;

async function getAllProducts() {
  await connect()
  const response = await Product.find({}, null, {sort:{'_id':-1}});
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}

/**
 * ItemList tells search engines this page is a product collection and gives
 * each entry a stable position, which is what lets a listing page surface as a
 * carousel rather than a single blue link.
 */
function listStructuredData(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `All products at ${BRAND.name}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/products/${product._id}`,
      name: product.title,
    })),
  };
}

export default async function ProductsPage() {
  const products = await getAllProducts()
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listStructuredData(products)) }}
        />
      )}
      <h1 className="mb-4 text-center text-2xl font-semibold text-fg md:mb-6 md:text-3xl">
        All Products
      </h1>
      {products.length === 0 ? (
        <p className="py-8 text-center">No products yet — check back soon.</p>
      ) : (
        <ProductsGrid products={products} />
      )}
    </div>
  );
}
