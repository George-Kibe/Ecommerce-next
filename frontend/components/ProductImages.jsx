"use client"
import { useState } from "react";
import ProductImage from "@/components/ProductImage";

/**
 * Product-page gallery: one large photo plus thumbnails to switch between.
 *
 * Both now go through next/image (via ProductImage) — they used to be raw
 * <img> tags, so a phone downloaded the full-size original for a 64px
 * thumbnail. Thumbnails are real <button>s with aria-pressed, 64px square
 * (above the 44pt minimum), with the selection shown by a thick border as well
 * as colour.
 */
export default function ProductImages({ images = [], title = "" }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] w-full">
        <ProductImage src={null} alt={title} rounded="rounded-md" />
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[4/3] w-full">
        {/* key resets the loading skeleton when the photo changes. */}
        <ProductImage
          key={images[active]}
          src={images[active]}
          alt={images.length > 1 ? `${title} — image ${active + 1} of ${images.length}` : title}
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={active === 0}
          padding="p-4"
          rounded="rounded-md"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((image, index) => {
            const isActive = index === active;
            return (
              <button
                key={image}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                onClick={() => setActive(index)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                  isActive ? "border-link" : "border-field-line hover:border-fg-muted"
                }`}
              >
                <ProductImage src={image} alt="" sizes="64px" padding="p-1" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
