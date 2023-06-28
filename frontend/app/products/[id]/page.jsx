
import Product from "@/models/Product";
import connect from "@/lib/db";
import DetailedProduct from "@/components/DetailedProduct";

const getProduct = async(id) => {
  await connect();
  const response = await Product.findById(id);
  const productData = JSON.parse(JSON.stringify(response))
  return productData
}

export default async function ProductPage({params}) {
  const {id} = params
  const product = await getProduct(id)
  return (
    <>
      <DetailedProduct product={product} />
    </>
  );
}
