"use client"
import { createContext, useCallback, useEffect, useRef, useState } from "react";

export const CartContext = createContext({});

const STORAGE_KEY = "cart";

function readCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private mode, blocked storage, or corrupt JSON — start from an empty cart.
    return [];
  }
}

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  // Tracks whether the stored cart has been loaded, so the first render (which
  // must match the server's empty cart) doesn't overwrite storage.
  const hydrated = useRef(false);
  // Exposed to the UI so the cart page can show a skeleton instead of briefly
  // claiming "Your cart is empty" before the saved cart is read.
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so this can only run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartProducts(readCart());
    hydrated.current = true;
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      // Persist unconditionally: the old code skipped empty carts, so clearing
      // the cart left the previous contents in storage to reappear on reload.
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartProducts));
    } catch {
      // Storage full or blocked — the in-memory cart still works.
    }
  }, [cartProducts]);

  const addProduct = useCallback((product) => {
    setCartProducts((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        // Replace in place so the cart keeps a stable order.
        return prev.map((p) =>
          p._id === product._id ? { ...p, quantity: (p.quantity ?? 0) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeQuantity = useCallback((product) => {
    setCartProducts((prev) =>
      prev
        .map((p) =>
          p._id === product._id ? { ...p, quantity: (p.quantity ?? 0) - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const removeProduct = useCallback((product) => {
    setCartProducts((prev) => prev.filter((p) => p._id !== product._id));
  }, []);

  const clearCart = useCallback(() => setCartProducts([]), []);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        cartReady,
        setCartProducts,
        addProduct,
        removeQuantity,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
