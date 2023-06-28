"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {createContext, useEffect, useState} from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts,setCartProducts] = useState([]);
  
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);
  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);
  function addProduct(product) {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    if(existingProduct){
      const newCartProducts = cartProducts.filter(p => p._id !== product._id)
      console.log("Cart Products: ", newCartProducts)
      existingProduct["quantity"] = existingProduct.quantity+1
      setCartProducts([existingProduct, ...newCartProducts]);
      toast.success("Product already in cart. Quantity added by one")
    }else{
      product["quantity"] = 1
      setCartProducts(prev => [...prev,product]);
      toast.success("Product added to cart")
    }    
  }
  function removeQuantity(product) {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    const newCartProducts = cartProducts.filter(p => p._id !== product._id)
    console.log("Cart Products in Remove: ", newCartProducts)  
    existingProduct["quantity"] = existingProduct.quantity - 1
    setCartProducts([existingProduct,...newCartProducts]);
  }

  function removeProduct(product) {
    const newCartProducts = cartProducts.filter(p => p._id !== product._id)
    setCartProducts(newCartProducts)
  }
  function clearCart() {
    setCartProducts([]);
  }
  return (
    <CartContext.Provider value={{cartProducts,setCartProducts,addProduct, removeQuantity,removeProduct,clearCart}}>
      <>
        <ToastContainer />
        {children}
      </>     
    </CartContext.Provider>
  );
}