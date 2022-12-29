import React, { useState, useEffect} from 'react'
import Card from '../Card/Card'
import axios from "axios"

import "./FeaturedProducts.scss"

const FeaturedProducts = ({type}) => {
  const [products, setProducts] = useState([])

  const fetchData = async () => {
    try{
        const response = await axios.get(process.env.REACT_APP_API_URL+`/products?populate=*&[filters][type][$eq]=${type}`, 
        {
            headers:{
                Authorization: "bearer " + process.env.REACT_APP_API_TOKEN,
            }
        })
        setProducts(response.data.data)
        //console.log(response.data.data)
    }catch(error){
        console.log(error)
    }
  }  

  useEffect(() => {    
    fetchData()
    
  }, [])
  

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
                products.map((item) => (
                    <Card item={item} key={item.id}/>
                ))
            }
        </div>
    </div>
  )
}

export default FeaturedProducts