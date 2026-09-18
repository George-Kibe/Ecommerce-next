import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import connect from "@/lib/db";
import Category from "@/models/Category";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Shop by Category",
  description: `Browse products by category at ${BRAND.name}.`,
  alternates: { canonical: "/categories" },
  openGraph: {
    title: `Shop by Category | ${BRAND.name}`,
    description: `Browse products by category at ${BRAND.name}.`,
    url: "/categories",
  },
};

export const revalidate = 60;

/**
 * Loads every product plus the category names in one pass.
 *
 * The previous version called an async getCategoryName() directly inside JSX,
 * which rendered a pending Promise instead of the name, and issued one query
 * per group.
 */
async function getProductsByCategory() {
  await connect();

  const [products, categories] = await Promise.all([
    Product.find({}, null, { sort: { _id: -1 } }),
    Category.find(),
  ]);

  const namesById = new Map(
    categories.map((category) => [String(category._id), category.name])
  );

  const groups = new Map();
  for (const product of products) {
    const key = product.category ? String(product.category) : "uncategorised";
    if (!groups.has(key)) {
      groups.set(key, {
        name: namesById.get(key) ?? "Not Categorized",
        products: [],
      });
    }
    groups.get(key).products.push(JSON.parse(JSON.stringify(product)));
  }

  return [...groups.entries()].map(([id, group]) => ({ id, ...group }));
}

export default async function CategoriesPage() {
  const groups = await getProductsByCategory();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="mb-6 text-center text-2xl font-semibold text-fg md:text-3xl">
        Shop by Category
      </h1>
      {groups.length === 0 && (
        <p className="p-8 text-center">No products yet.</p>
      )}
      {groups.map((group) => (
        <section key={group.id} className="mb-10 last:mb-0">
          <h2 className="mb-3 text-xl font-semibold text-fg md:mb-4 md:text-2xl">
            {group.name}
          </h2>
          <ProductsGrid products={group.products} />
        </section>
      ))}
    </div>
  );
}
