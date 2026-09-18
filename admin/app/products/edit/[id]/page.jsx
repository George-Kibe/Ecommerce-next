import mongoose from 'mongoose'
import { notFound } from 'next/navigation'
import connect from '@/lib/db'
import Product from '@/models/Product'
import Category from '@/models/Category'
import requireAdmin from '@/lib/requireAdmin'
import ProductForm from '@/components/ProductForm'

export const metadata = { title: 'Edit product — Admin' }
export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }) {
  await requireAdmin()

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) notFound()

  await connect()
  const [product, categories] = await Promise.all([
    Product.findById(id),
    Category.find().populate('parentCategory'),
  ])

  if (!product) notFound()

  return (
    <ProductForm
      {...JSON.parse(JSON.stringify(product))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  )
}
