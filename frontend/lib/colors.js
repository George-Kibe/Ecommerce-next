import { BRAND } from "@/lib/brand";

/**
 * Primary accent for the styled-components buttons.
 *
 * This was hardcoded to '#0D3D29' (dark green), so the product page's
 * "Add to cart" rendered green while every other button on the site was brand
 * blue. It now tracks the brand colour.
 */
export const primary = BRAND.color;
export const primaryDeep = BRAND.colorDeep;
