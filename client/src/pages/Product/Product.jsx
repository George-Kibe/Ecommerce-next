import React, {useState} from 'react'
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import Balanceicon from "@mui/icons-material/Balance"

import "./Product.scss"

function Product() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const images = [
    "https://i.ibb.co/h79LrJD/T-Shirt.jpg",
    "https://i.ibb.co/nnH3WgQ/placeholder4.jpg"
  ]

  return (
    <div className='product'>
      <div className="left">
        <div className="images">
          <img src={images[0]} alt="" onClick={e => setSelectedImage(0)} />
          <img src={images[1]} alt="" onClick={e => setSelectedImage(1)} />
        </div>
        <div className="mainImg">
          <img src={images[selectedImage]} alt="" />
        </div>
      </div>
      <div className="right">
        <h1>Product Title</h1>
        <span>Kshs. 2500</span>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et, repudiandae. Quidem aut sapiente quae ipsam dolorum hic eaque quasi repellat asperiores et quas, cum quibusdam consectetur qui corporis eos excepturi totam in veniam enim earum nemo. Quos eligendi iusto, repellendus fugiat aut sit ipsam soluta aspernatur, similique dolorem nam quam sequi deserunt, unde cum id quod molestias necessitatibus dolorum magni perspiciatis fuga. Laboriosam asperiores voluptate, iure porro quis ab officia fuga temporibus eaque obcaecati beatae nesciunt modi repudiandae dignissimos perspiciatis placeat perferendis aperiam molestias maxime voluptatum pariatur itaque, minus sed odio? Aliquam alias quod nesciunt, libero vel tempora ipsa adipisci error architecto veniam, molestiae id illum voluptas pariatur deserunt dicta facere, molestias corporis dolorem consequuntur velit ea. Dolores quia dolorem suscipit minima corrupti libero ratione nostrum amet dolorum harum cumque unde temporibus consequatur commodi sequi dicta ab, praesentium est mollitia dignissimos quae perferendis? Laudantium voluptate inventore, animi vitae itaque ex, sed beatae ullam ea similique modi placeat commodi! Quidem, assumenda dolor repellendus laborum aperiam dicta voluptas tenetur explicabo corporis maxime error debitis at repellat deleniti corrupti quaerat nisi! Quod enim quos, neque totam earum magni laudantium ducimus ab, nihil sit voluptas sint ipsum et explicabo officiis a repellendus laborum nostrum.
        </p>
        <div className="quantity">
          <button onClick={() =>setQuantity(prev=>prev === 1? 1 : prev-1)}>-</button>
          {quantity}
          <button onClick={() =>setQuantity(prev=>prev+1)}>+</button>
        </div>
        <button className="add">
          <AddShoppingCartIcon /> ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default Product