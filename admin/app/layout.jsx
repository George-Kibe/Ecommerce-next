import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/context/AuthProvider'
import AdminShell from '@/components/AdminShell'
import ThemeProvider from '@/components/ThemeProvider'
import ThemedToastContainer from '@/components/ThemedToastContainer'
import ThemeColorMeta from '@/components/ThemeColorMeta'
import { auth, adminEmails } from '@/lib/auth'
import { BRAND } from '@/lib/brand'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: {
    default: `Admin — ${BRAND.name}`,
    template: `%s | ${BRAND.name} Admin`,
  },
  description: 'Product, category and order management',
  // A private dashboard: never index, never follow, and don't let search
  // engines cache or snippet it either.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export const viewport = {
  // Mobile browser UI colour, matched to the top bar in each theme.
  // ThemeColorMeta overrides it when the chosen theme differs from the device.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }) {
  // Resolved on the server so the sidebar is correct on first paint. This only
  // decides what chrome to show — every page and API route still enforces
  // access itself (requireAdmin / withAdmin).
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  const isAdmin = Boolean(email && adminEmails.includes(email))

  return (
    // suppressHydrationWarning: next-themes sets data-theme on <html> before
    // React hydrates, so that attribute legitimately differs from the SSR HTML.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-page text-fg`}>
        <ThemeProvider>
          <AuthProvider>
            <AdminShell
              isAdmin={isAdmin}
              user={isAdmin ? { name: session.user.name, image: session.user.image } : null}
            >
              {children}
            </AdminShell>
            <ThemedToastContainer />
            <ThemeColorMeta light="#ffffff" dark="#030712" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
