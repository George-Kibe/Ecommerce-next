import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { Inter } from 'next/font/google'
import AuthProvider from '@/context/AuthProvider'
import AdminShell from '@/components/AdminShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin — Ecommerce',
  description: 'Product, category and order management',
  robots: { index: false, follow: false },
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
