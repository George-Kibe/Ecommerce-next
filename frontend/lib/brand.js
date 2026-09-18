/**
 * Single source of truth for brand identity.
 *
 * The logo component, the generated favicon/apple-icon, the Open Graph images,
 * the web manifest, every page title and the Organization structured data all
 * read from here — change `name` and the whole surface follows.
 *
 * NOTE: `name` is still the placeholder the project shipped with. Replace it
 * with the real store name; nothing else needs editing.
 */
export const BRAND = {
  name: "Buneas Store",
  // Shown in the footer, the manifest and as the default meta description.
  tagline: "Shop our range of products with fast, secure checkout.",
  // Drives the logo mark, the manifest theme colour and the browser UI colour.
  color: "#1d4ed8",
  colorDeep: "#1e3a8a",
  // The single letter used for the monogram mark.
  get monogram() {
    return this.name.trim().charAt(0).toUpperCase();
  },
};

/** Public origin, without a trailing slash. Used for canonicals and sitemaps. */
export const SITE_URL = (process.env.PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");
