import React from 'react'
import Card from '../Card/Card'
import "./List.scss"

const List = () => {
  const data =[
    {
        id:1,
        img:"https://i.ibb.co/NFfj5k7/shoes.jpg",
        title:"Shoes",
        oldprice:12435,
        price:34628
    },
    {
        id:2,
        img:"https://i.ibb.co/h79LrJD/T-Shirt.jpg",
        title:"Shirts",
        oldprice:12435,
        price:34628
    },
    {
        id:3,
        img:"https://i.ibb.co/NFfj5k7/shoes.jpg",
        title:"Shoes",
        oldprice:12435,
        price:34628
    },
    {
        id:4,
        img:"https://i.ibb.co/h79LrJD/T-Shirt.jpg",
        title:"Shirts",
        oldprice:12435,
        price:34628
    },
  ]
  return (
    <div className='list'>
        {
            data?.map(item => (
                <Card item={item} key={item.id} />
            ))
        }
    </div>
  )
}

export default List