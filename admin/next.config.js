/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // The admin is private; keep it out of search results entirely.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
]

const nextConfig = {
    // `images.domains` was removed in Next 16 — remotePatterns is the replacement.
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "mernbnb-images-bucket.s3.eu-west-1.amazonaws.com" },
            { protocol: "https", hostname: "mernbnb-images-bucket.s3.amazonaws.com" },
        ],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production"
          ? { exclude: ["error", "warn"] }
          : false,
    },
    poweredByHeader: false,
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }]
    },
}

module.exports = nextConfig
