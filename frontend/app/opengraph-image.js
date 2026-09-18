import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

// Site-wide social card, used whenever a page doesn't define its own.
// 1200x630 is the size Facebook, LinkedIn, Slack and X all crop from.
export const alt = `${BRAND.name} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: `linear-gradient(135deg, ${BRAND.colorDeep} 0%, ${BRAND.color} 100%)`,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "rgba(255,255,255,0.15)",
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          {BRAND.monogram}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {BRAND.name}
        </div>
        <div style={{ fontSize: 34, opacity: 0.85, marginTop: 16 }}>
          {BRAND.tagline}
        </div>
      </div>
    ),
    size
  );
}
