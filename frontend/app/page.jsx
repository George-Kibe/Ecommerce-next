import Featured from '@/components/Featured'
import NewProducts from '@/components/NewProducts'
import connect from '@/lib/db'
import Product from '@/models/Product'

async function getFeaturedProductDetails(id) {
  await connect()
  const response = await Product.findById(id);
  const productData = JSON.parse(JSON.stringify(response))
  return productData
}

async function getLatestProducts() {
  await connect()
  const response = await Product.find({}, null, {sort: {"_id": -1}, limit:10})
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}


export default async function Home() {
  const product = await getFeaturedProductDetails("6495b282df662ccaa8441082")
  const latestProducts = await getLatestProducts()
  // console.log(latestProducts)
  return (
    <main className="w-full h-full">
      <Featured product={product}/>
      <NewProducts products={latestProducts} />
    </main>
  )
}
