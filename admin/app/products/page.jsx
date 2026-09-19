import Link from 'next/link'
import connect from '@/lib/db'
import Product from '@/models/Product'
import requireAdmin from '@/lib/requireAdmin'
import ProductsTable from '@/components/ProductsTable'
import { PageHeader, EmptyState, buttonClass } from '@/components/ui'

export const metadata = { title: 'Products' }
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
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"}`}
        action={<Link href="/products/new" className={buttonClass.primary}>Add product</Link>}
      />

      {products.length === 0 ? (
        <EmptyState title="No products yet">Add your first product to start selling.</EmptyState>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}
