"use client"
import { toast } from "react-toastify";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Center from "./Center";
import ProductImages from "./ProductImages";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";

export default function DetailedProduct({ product }) {
  const { addProduct, cartProducts } = useContext(CartContext);

  function handleAddToCart() {
    const existing = cartProducts.find((p) => p._id === product._id);
    existing && toast.success("Item already in cart — quantity increased");
    addProduct(product);
  }

  return (
    <Center className="py-8 md:py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_3fr] md:gap-10">
        <div className="rounded-xl border border-line bg-surface-muted p-4 md:p-6">
          <ProductImages images={product.images ?? []} title={product.title} />
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-semibold leading-tight text-fg md:text-4xl">{product.title}</h1>
          <p className="whitespace-pre-line text-fg-muted md:text-lg">{product.description}</p>

          {/* Wraps instead of overflowing when price and button don't fit side
              by side. "Kshs." matches the cards and cart — which currency is
              actually correct is still open (see readme). */}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <span className="text-2xl font-semibold text-fg">Kshs.&nbsp;{product.price}</span>
            <Button variant="primary" onClick={handleAddToCart} aria-label={`Add ${product.title} to cart`}>
              <CartIcon />
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </Center>
  );
}
