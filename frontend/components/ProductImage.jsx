"use client"

import { useState } from "react"
import Image from "next/image"

const ImageOffIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.4 5H19a2 2 0 0 1 2 2v8.6M17 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 1.3-1.9" />
    <path d="M3 16l5-5 3 3M14.5 11.5L16 10l5 5" />
  </svg>
)

/**
 * Every product photo on the storefront goes through this.
 *
 * - next/image for resizing, modern formats (AVIF/WebP, see next.config.js)
 *   and lazy loading.
 * - A pulsing skeleton behind the photo until it has loaded, so the grid
 *   doesn't flash empty white boxes while images stream in. The photo itself is
 *   never hidden — if JavaScript is slow, the browser still paints it over the
 *   skeleton as it arrives.
 * - A clear "Image unavailable" state when the URL is missing or fails. Several
 *   stored products point at S3 objects that no longer exist; those used to
 *   render the browser's broken-image icon plus raw alt text.
 * - The white `image-tile` surface, dimmed as a unit in dark mode.
 *
 * The parent sets the size: this fills a positioned box (`fill`).
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  eager = false,
  className = "",
  padding = "p-3",
  rounded = "",
}) {
  const [status, setStatus] = useState(src ? "loading" : "error")

  return (
    // @container: the fallback adapts to the tile's own size, not the page's —
    // the same component renders at 48px (admin table) and 600px (hero).
    <div className={`@container image-tile relative h-full w-full overflow-hidden ${rounded} ${className}`}>
      {status === "loading" && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-line/60" />
      )}

      {status === "error" ? (
        <div
          // Decorative uses (alt="") stay silent; otherwise announce the product
          // plus the fact that its photo is missing.
          {...(alt ? { role: "img", "aria-label": `${alt} — image unavailable` } : { "aria-hidden": true })}
          className="flex h-full w-full flex-col items-center justify-center gap-1 bg-surface-muted p-1 text-center text-fg-muted"
        >
          <ImageOffIcon className="h-5 w-5 @[6rem]:h-7 @[6rem]:w-7" />
          {/* The label only appears where it fits; in small thumbnails it was
              clipped to "navailab". The accessible name is always present. */}
          <span aria-hidden="true" className="hidden text-xs @[6rem]:inline">Image unavailable</span>
        </div>
      ) : (
        <Image
          fill
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : eager ? "eager" : "lazy"}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`object-contain ${padding}`}
        />
      )}
    </div>
  )
}
