import connect from "@/lib/db";
import Product from "@/models/Product";

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.PUBLIC_URL;
  if (!baseUrl) return [];

  const staticRoutes = ["", "/products", "/categories", "/account"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  try {
    await connect();
    const products = await Product.find({}, "_id updatedAt").limit(5000);
    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastModified: product.updatedAt ?? new Date(),
      })),
    ];
  } catch (error) {
    // A database outage shouldn't fail the whole sitemap.
    console.error("[sitemap] could not load products:", error);
    return staticRoutes;
  }
}
