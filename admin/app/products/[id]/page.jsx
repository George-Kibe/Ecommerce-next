"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const ViewProductInformation = () => {
  const pathname = usePathname();
  const router = useRouter()
  const id = pathname.split("/")[-1]
  console.log("ID:", id)

  return (
    <div>ViewProductInformation</div>
  )
}

export default ViewProductInformation