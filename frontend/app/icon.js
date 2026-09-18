import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

// Replaces the deleted favicon.ico. Generated at build time from lib/brand.js,
// so renaming the store reissues the icon with no asset to redraw by hand.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.color,
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        {BRAND.monogram}
      </div>
    ),
    size
  );
}
