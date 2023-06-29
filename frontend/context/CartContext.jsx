"use client"
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
      existingProduct["quantity"] = existingProduct.quantity+1
      setCartProducts([existingProduct, ...newCartProducts]);
    }else{
      product["quantity"] = 1
      setCartProducts(prev => [...prev,product]);
    }    
  }
  function removeQuantity(product) {
    const existingProduct = cartProducts.find((p) => p._id === product._id)
    const newCartProducts = cartProducts.filter(p => p._id !== product._id) 
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
      {children}   
    </CartContext.Provider>
  );
}