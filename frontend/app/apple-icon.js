import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

// Home-screen icon for iOS. Apple renders it on an opaque tile and applies its
// own corner radius, so this fills the canvas rather than rounding it here.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 110,
          fontWeight: 700,
        }}
      >
        {BRAND.monogram}
      </div>
    ),
    size
  );
}
