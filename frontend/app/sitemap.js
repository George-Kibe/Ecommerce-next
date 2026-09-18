import connect from "@/lib/db";
import Product from "@/models/Product";
import { SITE_URL } from "@/lib/brand";

export const revalidate = 3600;

/**
 * Sitemap.
 *
 * /cart and /account are deliberately absent — they're disallowed in robots.js,
 * and listing a page you've blocked sends crawlers a contradictory signal.
 * Priorities are relative within the site: the homepage and product listing
 * outrank individual products, which outrank static pages.
 */
export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    await connect();
    // Google caps a single sitemap at 50,000 URLs; stay well inside it.
    const products = await Product.find({}, "_id updatedAt").sort({ _id: -1 }).limit(5000);

    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${SITE_URL}/products/${product._id}`,
        lastModified: product.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    ];
  } catch (error) {
    // A database outage shouldn't fail the whole sitemap — serving the static
    // routes is better than serving a 500 to a crawler.
    console.error("[sitemap] could not load products:", error);
    return staticRoutes;
  }
}
