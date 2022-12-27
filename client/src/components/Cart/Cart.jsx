import React from 'react'
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import "./Cart.scss"

function Cart() {

  const data = [
    {
        id:1,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, inventore. Impedit a error totam harum dolor laborum cumque sint itaque!",
        isNew:true,
        oldPrice:2500,
        price:1500
    },
    {
        id:2,
        img:"https://i.ibb.co/7jbBCdR/realestate14.jpg",
        img2:"https://i.ibb.co/zHyKh32/realestate17.jpg",
        title:"Luxurious 5 Bed Maisonette",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, inventore. Impedit a error totam harum dolor laborum cumque sint itaque!",
        isNew:false,
        oldPrice:2500,
        price:1500
    }
  ]
  return (
    <div className='cart'>
        <h1>Products in your Cart</h1>
        { data?.map((item) => (
            <div className="item" key={item.id}>
                <img src={item.img} alt="" />
                <div className="details">
                    <h1>{item.title}</h1>
                    <p>{item.description.substring(0, 100)}</p>
                    <div className="price">1 X Kshs. {item.price}</div>
                </div>
                <DeleteOutlinedIcon className='delete' />
            </div>
        ))
        }
        <div className="total">
            <span>SUBTOTAL</span>
            <span>Kshs. 5600</span>
        </div>
        <button>PROCEED TO CHECKOUT</button>
        <span className="reset">Reset Cart</span>
    </div>
  )
}

export default Cart