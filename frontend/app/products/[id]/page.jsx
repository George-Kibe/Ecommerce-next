import React from 'react'

const page = ({params}) => {
  const {id} = params
  return (
    <div>page for product id -{id}</div>
  )
}

export default page