import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { Inter } from 'next/font/google'
import AuthProvider from '@/context/AuthProvider'
import AdminShell from '@/components/AdminShell'
import { BRAND } from '@/lib/brand'

const inter = Inter({ subsets: ['latin'] })

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
  themeColor: BRAND.color,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
          {/* Single container for the whole app rather than one per page. */}
          <ToastContainer position="bottom-right" newestOnTop />
        </AuthProvider>
      </body>
    </html>
  )
}
