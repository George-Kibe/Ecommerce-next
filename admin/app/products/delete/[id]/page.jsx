import mongoose from 'mongoose'
import { notFound } from 'next/navigation'
import connect from '@/lib/db'
import Product from '@/models/Product'
import requireAdmin from '@/lib/requireAdmin'
import DeleteProductConfirm from '@/components/DeleteProductConfirm'

export const metadata = { title: 'Delete product — Admin' }
export const dynamic = 'force-dynamic'

export default async function DeleteProductPage({ params }) {
  await requireAdmin()

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) notFound()

  await connect()
  const product = await Product.findById(id)
  if (!product) notFound()

  return <DeleteProductConfirm product={JSON.parse(JSON.stringify(product))} />
}
