import connect from '@/lib/db';
import Category from '@/models/Category';
import requireAdmin from '@/lib/requireAdmin';
import ProductForm from '@/components/ProductForm';

export const metadata = { title: 'New product' };
export const dynamic = 'force-dynamic';

export default async function AddNewProductPage() {
  await requireAdmin();

  await connect();
  const categories = await Category.find().populate('parentCategory');

  return <ProductForm categories={JSON.parse(JSON.stringify(categories))} />;
}
