import Center from "@/components/Center";
import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import connect from "@/lib/db";
import Category from "@/models/Category";

async function getAllProducts() {
  await connect()
  const response = await Product.find({}, null, {sort:{'_id':-1}});
  const productsData = JSON.parse(JSON.stringify(response))
  return productsData
}
async function getCategoryName(_id) {
  await connect()
  try {
    const response = await Category.findById({_id});
    const category = JSON.parse(JSON.stringify(response))
    return category.name
  } catch (error) {
    return "Not Categorized"
  }  
}

function groupArrayByAttribute(array, attribute) {
  return array.reduce((groupedArrays, item) => {
    const key = item[attribute];
    if (!groupedArrays[key]) {
      groupedArrays[key] = [];
    }
    groupedArrays[key].push(item);
    return groupedArrays;
  }, {});
}

export default async function CategoriesPage() {
  // Todo Group  By Categories Later
  const products = await getAllProducts()
  const groupedProducts = groupArrayByAttribute(products, 'category');
  const keys = Object.keys(groupedProducts); //These are category IDs
  const cat = await getCategoryName("64998224cde31de3a34e4")
  // console.log("Category", cat)
  // console.log(keys)
  // console.log(groupedProducts[keys[0]])
  return (
    <>
      <Center>
        {
          keys.map((key, index) => (
            <div key={index} className="p-2 md:px-4 lg:px-8 flex flex-col items-center">
              <h1 className="text-semibold text-justify text-[24px] md:text-[30px] mb-2 md:mb-4">{getCategoryName(key)}</h1>
              <ProductsGrid products={groupedProducts[key]} />
            </div>
          ))
        }
      </Center>
    </>
  );
}
