import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { Poppins } from 'next/font/google'
import { CartContextProvider } from '@/context/CartContext'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry'

const poppins = Poppins({ subsets: ['latin'] , weight:["400"]})

export const metadata = {
  metadataBase: process.env.PUBLIC_URL
    ? new URL(process.env.PUBLIC_URL)
    : undefined,
  title: {
    default: 'Ecommerce',
    template: '%s | Ecommerce',
  },
  description: 'Shop our range of products with fast, secure checkout.',
  openGraph: {
    title: 'Ecommerce',
    description: 'Shop our range of products with fast, secure checkout.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex flex-col justify-between bg-gray-300 min-h-screen w-full h-full`}>
        <StyledComponentsRegistry>
          <CartContextProvider>
            <Navbar />
            {children}
            <Footer />
          </CartContextProvider>
          {/* One container for the whole app — it used to be rendered once per
              product card, which duplicated every toast. */}
          <ToastContainer position="bottom-right" newestOnTop />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
