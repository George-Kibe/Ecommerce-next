import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "@/context/CartContext";

const ProductWrapper = styled.div`
  background-color: whitesmoke;
  padding: 10px;
  border-radius: 5px;
`;

const WhiteBox = styled(Link)`
  background-color: transparent;
  padding: 10px;
  height: 160px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 160px;
    border-radius: 10px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 0.8rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({_id,title,price,images}) {
  const {addProduct} = useContext(CartContext);
  const url = '/products/'+_id;
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images?.[0]} alt={title}/>
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            Kshs.&nbsp;{price}
          </Price>
          <Button white onClick={() => addProduct(_id)} primary outline>
            <CartIcon />
            Add&nbsp;to&nbsp;cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}