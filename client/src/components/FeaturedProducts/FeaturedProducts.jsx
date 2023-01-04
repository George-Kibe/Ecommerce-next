import React, { useState, useEffect} from 'react'
import Card from '../Card/Card'
import useFetch from '../../hooks/useFetch'

import "./FeaturedProducts.scss"

const FeaturedProducts = ({type}) => {
  const {products, loading, error} = useFetch(`/products?populate=*&[filters][type][$eq]=${type}`)
  return (
    <div className='featuredProducts'>
        <div className="top">
            <h1>{type} products</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam ea tenetur eligendi provident nisi molestiae dignissimos, eos ad cum labore minus soluta sit natus laborum rerum et nihil quidem magnam perspiciatis unde ducimus! Ad sapiente, labore voluptatum soluta, eius nesciunt sunt numquam harum consequuntur hic odio aperiam, enim illum? Qui earum error similique animi. Adipisci voluptates natus cum mollitia tempora veritatis fugit voluptate minima. Illum nulla aliquam veritatis accusamus praesentium?
            </p>
        </div>
        <div className="bottom">
            {  error? "Something Went Wrong!" :
               loading? "Loading" :
               products?.map((item) => (
                 <Card item={item} key={item.id}/>
               ))
            }
        </div>
    </div>
  )
}

export default FeaturedProducts