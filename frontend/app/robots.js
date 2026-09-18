import { SITE_URL } from "@/lib/brand";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // None of these are useful in an index: the cart and account are
        // per-visitor, and the API returns JSON. Blocking them also stops
        // crawl budget being spent on pages that can never rank.
        disallow: ["/api/", "/cart", "/account", "/*?success=", "/*?canceled="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
