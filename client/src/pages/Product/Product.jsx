import React, {useState} from 'react'
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import BalanceIcon from "@mui/icons-material/Balance"
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'

import "./Product.scss"
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/cartReducer'

function Product() {
  const id = useParams().id
  const [selectedImage, setSelectedImage] = useState("img")
  const [quantity, setQuantity] = useState(1)
  const imagesPath = process.env.REACT_APP_MEDIA_URL
  const dispatch = useDispatch()

  //console.log(imagesPath)

  const {products:product, loading, error} = useFetch(`/products/${id}?populate=*`);

  return (
    <div className='product'>
      {
        loading? ("Loading!"):
        (
        <>
          <div className="left">
            <div className="images">
              <img src={imagesPath+product?.attributes?.img?.data?.attributes?.url} alt="" onClick={e => setSelectedImage("img")} />
              <img src={imagesPath+product?.attributes.img2.data.attributes?.url} alt="" onClick={e => setSelectedImage("img2")} />
            </div>
            <div className="mainImg">
              <img src={imagesPath+product?.attributes[selectedImage].data.attributes?.url} alt="" />
            </div>
          </div>
          <div className="right">
            <h1>{product?.attributes.title}</h1>
            <span className='price'>{product?.attributes?.price}</span>
            <p>
              {product?.attributes?.description}
            </p>
            <div className="quantity">
              <button onClick={() =>setQuantity(prev=>prev === 1? 1 : prev-1)}>-</button>
              {quantity}
              <button onClick={() =>setQuantity(prev=>prev+1)}>+</button>
            </div>
            <button className="add" 
              onClick = {() => 
                dispatch(
                  addToCart({
                    id: product.id,
                    title:product.attributes.title,
                    description:product.attributes.description,
                    price:product.attributes.price,
                    img:product.attributes.img.data.attributes.url,
                    quantity,
                })
                )
              }
            >
              <AddShoppingCartIcon /> ADD TO CART
            </button>
            <div className="links">
              <div className="item">
                <FavoriteBorderIcon/> ADD TO WISH LIST
              </div>
              <div className="item">
                <BalanceIcon/> ADD TO COMPARE
              </div>
            </div>
            <div className="info">
              <span>Vendor:Polo</span>
              <span>Product Type: T-Shirt</span>
              <span>Tag: T-Shirt, Women, Top</span>
            </div>
            <hr />
            <div className="info">
              <span>DESCRIPTION</span>
              <hr />
              <span>ADDITIONAL INFORMATION</span>
              <hr />
              <span>FAQs</span>
            </div>
          </div>        
        </>
        )
      }
     
    </div>
  )
}

export default Product