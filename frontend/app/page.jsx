import mongoose from 'mongoose'
import Featured from '@/components/Featured'
import NewProducts from '@/components/NewProducts'
import connect from '@/lib/db'
import Product from '@/models/Product'

/**
 * The featured product is chosen by FEATURED_PRODUCT_ID when set, otherwise it
 * falls back to the newest product. Previously this was a hardcoded id, so the
 * whole build failed if that document was ever deleted.
 */
async function getFeaturedProduct() {
  await connect()
  const id = process.env.FEATURED_PRODUCT_ID

  if (id && mongoose.isValidObjectId(id)) {
    const featured = await Product.findById(id)
    if (featured) return JSON.parse(JSON.stringify(featured))
  }

  const newest = await Product.findOne({}, null, { sort: { _id: -1 } })
  return newest ? JSON.parse(JSON.stringify(newest)) : null
}

async function getLatestProducts() {
  await connect()
  const response = await Product.find({}, null, { sort: { _id: -1 }, limit: 10 })
  return JSON.parse(JSON.stringify(response))
}

// Product data changes independently of deploys; re-render at most once a minute.
export const revalidate = 60

export default async function Home() {
  const [product, latestProducts] = await Promise.all([
    getFeaturedProduct(),
    getLatestProducts(),
  ])

  return (
    // The root layout supplies <main>; this is just the page wrapper.
    <div className="w-full h-full">
      {product && <Featured product={product} />}
      {!product && (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Our store is getting ready</h1>
          <p className="mt-2">Products will appear here shortly.</p>
        </div>
      )}
      <NewProducts products={latestProducts} />
    </div>
  )
}
