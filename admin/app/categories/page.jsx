import connect from '@/lib/db';
import Category from '@/models/Category';
import requireAdmin from '@/lib/requireAdmin';
import CategoriesManager from '@/components/CategoriesManager';

export const metadata = { title: 'Categories' };
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  await requireAdmin();

  await connect();
  const categories = await Category.find().populate('parentCategory').sort({ name: 1 });

  return <CategoriesManager categories={JSON.parse(JSON.stringify(categories))} />;
}
