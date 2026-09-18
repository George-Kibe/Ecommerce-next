import Link from 'next/link'
import connect from '@/lib/db'
import Product from '@/models/Product'
import requireAdmin from '@/lib/requireAdmin'
import ProductsTable from '@/components/ProductsTable'

export const metadata = { title: 'Products — Admin' }
export const dynamic = 'force-dynamic'

async function getProducts() {
  await connect()
  const products = await Product.find().sort({ _id: -1 })
  return JSON.parse(JSON.stringify(products))
}

export default async function AllProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div>
        <Link href="/products/new" className='bg-blue-900 text-white p-2 rounded-xl'>
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-4">No Product Yet</div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}
