import Featured from '@/components/Featured'
import connect from '@/lib/db'
import Product from '@/models/Product'
import Image from 'next/image'

async function getFeaturedProductDetails(id) {
  await connect()
  const response = await Product.findById(id);
  const productData = JSON.parse(JSON.stringify(response))
  return productData
}

export default async function Home() {
  const product = await getFeaturedProductDetails("6495b282df662ccaa8441082")
  return (
    <main className="w-full h-full">
      <Featured product={product}/>
    </main>
  )
}
