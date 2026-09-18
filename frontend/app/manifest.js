import { BRAND } from "@/lib/brand";

// Web app manifest — drives "Add to Home Screen" naming and colours, and is one
// of the installability signals Lighthouse checks.
export default function manifest() {
  return {
    name: `${BRAND.name} — ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: BRAND.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: BRAND.color,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
