/** @type {import('next').NextConfig} */

const nextConfig = {
    // `images.domains` was removed in Next 16 — remotePatterns is the replacement.
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "mernbnb-images-bucket.s3.eu-west-1.amazonaws.com" },
            { protocol: "https", hostname: "dawid-next-ecommerce.s3.amazonaws.com" },
        ],
    },
    // Required for styled-components to render correctly on the server.
    compiler: {
        styledComponents: true,
    },
}

module.exports = nextConfig
