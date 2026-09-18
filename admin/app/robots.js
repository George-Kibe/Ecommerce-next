/**
 * The admin is a private dashboard — it must never appear in search results.
 *
 * This complements the `X-Robots-Tag: noindex, nofollow` header set in
 * next.config.js and the `robots` metadata in the root layout. robots.txt alone
 * is not enough: it asks crawlers not to *fetch* a URL, but a URL linked from
 * elsewhere can still be indexed without being fetched. The header and meta tag
 * are what actually keep it out.
 */
export default function robots() {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
