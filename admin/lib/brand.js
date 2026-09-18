/**
 * Brand identity for the admin app. Kept in step with frontend/lib/brand.js —
 * if you rename the store, change it in both.
 *
 * The admin is deliberately never indexed, so there are no Open Graph images
 * here; this drives the logo, the generated icons and the page titles only.
 */
export const BRAND = {
  name: "Buneas Store",
  color: "#1e3a8a",
  colorDeep: "#1e3a8a",
  get monogram() {
    return this.name.trim().charAt(0).toUpperCase();
  },
};
