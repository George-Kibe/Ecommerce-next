"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Center from "./Center";
import Title from "./Title";
import styled from "styled-components";
import WhiteBox from "./WhiteBox";
import ProductImages from "./ProductImages";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/context/CartContext";
;

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default  function DetailedProduct({product}) {
  const {addProduct, cartProducts} = useContext(CartContext);
  function handleAddToCart(product) {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    existingProduct && toast.success("Item Already in cart. Quantity added by one")
    addProduct(product)
  }
  return (
    <>
    <ToastContainer />
      <Center>
        <ColWrapper>
          <WhiteBox>
            { product.images?.length > 0 ? <ProductImages images={product.images} /> :"No Image" }            
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <Button primary={1} onClick={() => handleAddToCart(product)}>
                  <CartIcon />Add to cart
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}
