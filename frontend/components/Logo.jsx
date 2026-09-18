import { BRAND } from "@/lib/brand";

/**
 * The wordmark: a rounded monogram tile plus the store name.
 *
 * Drawn as inline SVG + text rather than an image file so it stays crisp at any
 * size, inherits the current text colour, needs no network request (no layout
 * shift), and picks up a rename from lib/brand.js automatically.
 */
export default function Logo({ className = "", showName = true, size = 32 }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-label={`${BRAND.name} logo`}
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill={BRAND.color} />
        {/* A bag handle over the monogram — reads as commerce at favicon size,
            where a letter alone is ambiguous. */}
        <path
          d="M11 12v-1.5a5 5 0 0 1 10 0V12"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="16"
          y="23"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#ffffff"
        >
          {BRAND.monogram}
        </text>
      </svg>
      {showName && (
        // nowrap so the wordmark never breaks onto two lines in the navbar.
        <span className="whitespace-nowrap text-xl font-semibold tracking-tight lg:text-2xl">
          {BRAND.name}
        </span>
      )}
    </span>
  );
}
