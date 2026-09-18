export default function robots() {
  const baseUrl = process.env.PUBLIC_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cart and checkout pages have nothing to index.
      disallow: ["/api/", "/cart"],
    },
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
  };
}
