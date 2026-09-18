import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Product from "@/models/Product";
import connect from "@/lib/db";
import DetailedProduct from "@/components/DetailedProduct";
import { BRAND, SITE_URL } from "@/lib/brand";

const getProduct = async (id) => {
  // An arbitrary string would make findById throw a CastError and surface as a
  // 500; an unknown product should be a 404.
  if (!mongoose.isValidObjectId(id)) return null;
  await connect();
  const response = await Product.findById(id);
  return response ? JSON.parse(JSON.stringify(response)) : null;
};

/** Trim to a clean sentence boundary near the meta-description sweet spot. */
function metaDescription(text, fallback) {
  if (!text) return fallback;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).replace(/[\s,.;:]+\S*$/, "")}…`;
}

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

  const description = metaDescription(product.description, `${product.title} — available at ${BRAND.name}.`);
  const url = `/products/${product._id}`;

  return {
    title: product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      url,
      siteName: BRAND.name,
      // Prefer the real product photo as the social card; the route-level
      // opengraph-image is the fallback when a product has no images.
      ...(product.images?.[0] ? { images: [{ url: product.images[0], alt: product.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      ...(product.images?.[0] ? { images: [product.images[0]] } : {}),
    },
  };
}

/**
 * Product + Breadcrumb structured data.
 *
 * Product is what makes a listing eligible for price/availability rich results
 * in Google Shopping and web search; BreadcrumbList replaces the raw URL in the
 * result with a readable trail.
 */
function productStructuredData(product) {
  const url = `${SITE_URL}/products/${product._id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description: product.description,
        ...(product.images?.length ? { image: product.images } : {}),
        sku: String(product._id),
        brand: { "@type": "Brand", name: BRAND.name },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: Number(product.price ?? 0).toFixed(2),
          availability: "https://schema.org/InStock",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
          { "@type": "ListItem", position: 3, name: product.title, item: url },
        ],
      },
    ],
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData(product)) }}
      />
      <DetailedProduct product={product} />
    </>
  );
}
