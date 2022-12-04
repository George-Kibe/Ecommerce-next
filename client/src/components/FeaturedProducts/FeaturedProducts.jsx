import React from 'react'
import Card from '../Card/Card'

import "./FeaturedProducts.scss"

const FeaturedProducts = ({type}) => {
  const data =[
    {
        id:1,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        isNew:true,
        oldPrice:2500,
        price:1500
    },
    {
        id:2,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        isNew:false,
        oldPrice:2500,
        price:1500
    },
    {
        id:3,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        isNew:true,
        oldPrice:2500,
        price:1500
    },
    {
        id:4,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        isNew:false,
        oldPrice:2500,
        price:1500
    },
  ]
  return (
    <div className='featuredProducts'>
        <div className="top">
            <h1>{type} products</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam ea tenetur eligendi provident nisi molestiae dignissimos, eos ad cum labore minus soluta sit natus laborum rerum et nihil quidem magnam perspiciatis unde ducimus! Ad sapiente, labore voluptatum soluta, eius nesciunt sunt numquam harum consequuntur hic odio aperiam, enim illum? Qui earum error similique animi. Adipisci voluptates natus cum mollitia tempora veritatis fugit voluptate minima. Illum nulla aliquam veritatis accusamus praesentium?
            </p>
        </div>
        <div className="bottom">
            {
                data.map((item) => (
                    <Card item={item} key={item.id}/>
                ))
            }
        </div>
    </div>
  )
}

export default FeaturedProducts