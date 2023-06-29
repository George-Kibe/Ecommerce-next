import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import connect from "@/lib/db";

async function getAllProducts() {
  await connect()
  const response = await Product.find({}, null, {sort:{'_id':-1}});
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}

export default async function ProductsPage() {
  const products = await getAllProducts()
  return (
    <div className="p-2 md:px-4 lg:px-8 flex flex-col items-center ">
      <h1 className="text-semibold text-justify text-[24px] md:text-[30px] mb-2 md:mb-4">All Products</h1>
      <ProductsGrid products={products} />
    </div>
  );
}
