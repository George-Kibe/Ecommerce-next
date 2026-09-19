"use client"

import { useState } from "react"
import Link from "next/link"
import Pagination from "@/components/Pagination"
import ProductImage from "@/components/ProductImage"
import { TableShell, buttonClass } from "@/components/ui"
import { formatDate } from "@/lib/formatDate"

const ITEMS_PER_PAGE = 10

/**
 * Product list. Data is fetched on the server and passed in, so this component
 * only owns pagination state. Each row shows a thumbnail — spotting a product
 * by its photo is much faster than by title.
 */
export default function ProductsTable({ products }) {
  const [currentPage, setCurrentPage] = useState(1)
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const pageItems = products.slice(start, start + ITEMS_PER_PAGE)

  return (
    <>
      <TableShell minWidth="44rem">
        <thead>
          <tr>
            <th className="w-16"><span className="sr-only">Image</span></th>
            <th>Product</th>
            <th>Price</th>
            <th>Description</th>
            <th>Created</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((product) => (
            <tr key={product._id} className="hover:bg-hover">
              <td>
                <div className="h-12 w-12 overflow-hidden rounded-md border border-line">
                  <ProductImage src={product.images?.[0]} alt="" sizes="48px" padding="p-0.5" />
                </div>
              </td>
              <td className="font-medium text-fg">{product.title}</td>
              <td className="whitespace-nowrap tabular-nums text-fg">Kshs.&nbsp;{product.price}</td>
              <td className="max-w-xs text-fg-muted">
                <span className="line-clamp-2">{product.description}</span>
              </td>
              <td className="whitespace-nowrap text-fg-muted">{formatDate(product.createdAt)}</td>
              <td>
                <div className="flex justify-end gap-2">
                  <Link href={`/products/edit/${product._id}`} className={buttonClass.secondary}
                    aria-label={`Edit ${product.title}`}>
                    Edit
                  </Link>
                  <Link href={`/products/delete/${product._id}`} className={buttonClass.danger}
                    aria-label={`Delete ${product.title}`}>
                    Delete
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <Pagination
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={products.length}
        paginate={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  )
}
