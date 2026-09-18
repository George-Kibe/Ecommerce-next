import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Poppins } from 'next/font/google'
import { CartContextProvider } from '@/context/CartContext'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry'
import ThemeProvider from '@/components/ThemeProvider'
import ThemedToastContainer from '@/components/ThemedToastContainer'
import { BRAND, SITE_URL } from '@/lib/brand'

// `display: swap` renders text in a fallback face immediately instead of
// blocking on the webfont — this is the difference between a fast and a
// blank first paint, which Core Web Vitals measures directly.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  // Required for Next to turn the relative URLs below into absolute ones.
  // Crawlers and social scrapers reject relative og:image and canonical values.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.tagline,
  applicationName: BRAND.name,
  // Every page gets a self-referencing canonical unless it overrides this,
  // which collapses duplicate URLs (tracking params, trailing slashes).
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.tagline,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show full-size image and video previews and untruncated
      // snippets, rather than the conservative defaults.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
}

export const viewport = {
  // Browser UI colour (address bar on mobile) — matches the navbar, which is
  // near-black in both themes.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
  // Never block pinch-zoom — capping user-scalable is an accessibility failure.
  maximumScale: 5,
}

/**
 * Site-wide structured data.
 *
 * Organization identifies the business; WebSite ties the pages together under
 * one publisher. Both are emitted once, in the root layout, so every page
 * carries them.
 *
 * No SearchAction / sitelinks searchbox is declared: the storefront has no
 * search endpoint yet, and advertising one that returns an unfiltered list is
 * a broken promise to the crawler. Add it here once /products honours ?q=.
 */
function siteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND.name,
        url: SITE_URL,
        logo: `${SITE_URL}/icon`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND.name,
        description: BRAND.tagline,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} flex flex-col justify-between bg-page text-fg min-h-screen w-full h-full`}>
        <script
          type="application/ld+json"
          // Values come from our own constants, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData()) }}
        />
        <ThemeProvider>
        <StyledComponentsRegistry>
          <CartContextProvider>
            <Navbar />
            {/* Landmark for skip-links and screen-reader rotors. */}
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </CartContextProvider>
          {/* One container for the whole app — it used to be rendered once per
              product card, which duplicated every toast. */}
          <ThemedToastContainer />
        </StyledComponentsRegistry>
        </ThemeProvider>
      </body>
    </html>
  )
}
