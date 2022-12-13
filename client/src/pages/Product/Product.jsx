import React, {useState} from 'react'


import "./Product.scss"

function Product() {
  const [selectedImage, setSelectedImage] = useState(0)

  const images = [
    "https://i.ibb.co/h79LrJD/T-Shirt.jpg",
    "https://i.ibb.co/nnH3WgQ/placeholder4.jpg"
  ]

  return (
    <div className='product'>
      <div className="lefty">
        <div className="images">
          <img src={images[0]} alt="" onClick={e => setSelectedImage(0)} />
          <img src={images[1]} alt="" onClick={e => setSelectedImage(1)} />
        </div>
        <div className="mainImg">
          <img src={images[selectedImage]} alt="" />
        </div>
      </div>
      <div className="right">

      </div>
    </div>
  )
}

export default Product