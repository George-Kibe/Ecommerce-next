"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/context/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import DeleteIcon from "@/components/icons/DeleteIcon";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: whitesmoke;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  align-self:center;
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

export default function CartPage() {
  const {cartProducts,addProduct,removeQuantity,removeProduct,clearCart} = useContext(CartContext);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  // console.log(cartProducts)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  function moreOfThisProduct(product) {
    addProduct(product);
  }
  function lessOfThisProduct(product) {
    if (product.quantity === 1 | product.quantity < 1){
      removeProduct(product);
    }else{
      removeQuantity(product)
    }
    
  }
  async function goToPayment() {
    if(!name|!email|!city|!streetAddress|!country|!cartProducts.length){
      toast.error("You have missing necessary details");
      return
    }
    toast.info("Processing Your Payment")
    try {
      const response = await axios.post('/api/checkout', {
        name,email,city,postalCode,streetAddress,country,
        cartProducts,
      });
      console.log("Checkout Response: ", response)
      if (response.data.url) {
        window.location = response.data.url;
      }
    } catch (error) {
      console.log(error.message)
      toast.error("Your order has not been processed. Try Again")
    }    
  }

  const total = cartProducts.reduce(
    (sum, cartProduct) => sum + cartProduct.price * cartProduct.quantity || 0,
    0,
  );

  if (isSuccess) {
    return (
      <>
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1 className='text-[25px] font-semibold'>Thanks for your order!</h1>
              <h1 className='text-[22px] font-medium'>We do not take it for granted that you chose to shop with us</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <ToastContainer /> 
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2 className="text-[25px] font-semibold">Cart</h2>
            {!cartProducts?.length && (
              <div>Your cart is empty</div>
            )}
            {cartProducts?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt=""/>
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <div className="flex item-center">
                          <button className="p-1 px-2 rounded-lg bg-blue-200"
                            onClick={() => lessOfThisProduct(product)}>
                              { product.quantity < 2 ? <DeleteIcon /> :"-" }
                            </button>
                          <QuantityLabel>
                            {product.quantity}
                          </QuantityLabel>
                          <button className="p-1 px-2 rounded-lg bg-blue-200"
                            onClick={() => moreOfThisProduct(product)}>+</button>
                        </div>
                      </td>
                      <td>
                        Kshs.&nbsp;{product.quantity * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Kshs.&nbsp;{total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>
              <Input type="text"
                     placeholder="Name"
                     value={name}
                     name="name"
                     onChange={ev => setName(ev.target.value)} />
              <Input type="text"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={ev => setEmail(ev.target.value)}/>
              <CityHolder>
                <Input type="text"
                       placeholder="City"
                       value={city}
                       name="city"
                       onChange={ev => setCity(ev.target.value)}/>
                <Input type="text"
                       placeholder="Postal Code"
                       value={postalCode}
                       name="postalCode"
                       onChange={ev => setPostalCode(ev.target.value)}/>
              </CityHolder>
              <Input type="text"
                     placeholder="Street Address"
                     value={streetAddress}
                     name="streetAddress"
                     onChange={ev => setStreetAddress(ev.target.value)}/>
              <Input type="text"
                     placeholder="Country"
                     value={country}
                     name="country"
                     onChange={ev => setCountry(ev.target.value)}/>
              <Button black={1} block={1}
                      onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
