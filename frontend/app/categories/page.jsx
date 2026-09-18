import Center from "@/components/Center";
import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import connect from "@/lib/db";
import Category from "@/models/Category";

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
    <Center>
      {groups.length === 0 && (
        <p className="p-8 text-center">No products yet.</p>
      )}
      {groups.map((group) => (
        <div
          key={group.id}
          className="p-2 md:px-4 lg:px-8 flex flex-col items-center"
        >
          <h2 className="font-semibold text-justify text-[24px] md:text-[30px] mb-2 md:mb-4">
            {group.name}
          </h2>
          <ProductsGrid products={group.products} />
        </div>
      ))}
    </Center>
  );
}
