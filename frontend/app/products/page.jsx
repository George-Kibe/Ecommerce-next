import Center from "@/components/Center";
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
    <>
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}
