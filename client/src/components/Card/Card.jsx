import React from 'react'
import { Link } from 'react-router-dom'

import "./Card.scss"


const Card = ({item}) => {
  return (
    <Link className='link' to={`/product/${item.id}`}>
        <div className='card'>
            <div className="image">
                {
                    item.isNew && <span>New Product</span>
                }
                <img src={item.img} alt="" className='mainImg' />
                <img src={item.img2} alt="" className='secondImg' />
            </div>
            <h2>{item.title}</h2>
            <div className="prices">
                <h3>Kshs{item.oldPrice}</h3>
                <h3>Kshs{item.price}</h3>
            </div>
        </div>
    </Link>
  )
}

export default Card