"use client"
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { CartContext } from "@/context/CartContext";
import Center from "@/components/Center";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Input from "@/components/Input";
import ProductImage from "@/components/ProductImage";
import DeleteIcon from "@/components/icons/DeleteIcon";

const Panel = ({ children, className = "" }) => (
  <section className={`rounded-xl border border-line bg-surface-muted p-5 text-fg md:p-7 ${className}`}>
    {children}
  </section>
);

/*
  Checkout fields have real labels (placeholders vanish as you type and aren't
  a reliable accessible name), proper input types, and autocomplete hints so
  browsers and password managers can fill the address in one tap.
*/
const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "city", label: "City", autoComplete: "address-level2", half: true },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code", half: true, optional: true },
  { name: "streetAddress", label: "Street address", autoComplete: "street-address" },
  { name: "country", label: "Country", autoComplete: "country-name" },
];

const stepperClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-accent-soft text-lg font-medium text-on-accent-soft hover:brightness-110";

function CartSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]">
      <span className="sr-only">Loading your cart…</span>
      <Panel>
        <div className="mb-5 h-7 w-24 animate-pulse rounded-md bg-line" aria-hidden="true" />
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-divider py-3" aria-hidden="true">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-line/60" />
            <div className="h-4 flex-1 animate-pulse rounded-md bg-line" />
            <div className="h-11 w-32 animate-pulse rounded-md bg-line" />
          </div>
        ))}
      </Panel>
    </div>
  );
}

export default function CartPage() {
  const { cartProducts, cartReady, addProduct, removeQuantity, removeProduct, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({ name: "", email: "", city: "", postalCode: "", streetAddress: "", country: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    // Parse the query string rather than substring-matching the whole URL,
    // which also matched any product or host containing "success".
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSuccess(true);
      clearCart();
      toast.success("Thank you for shopping with us");
    }
  }, [clearCart]);

  function lessOfThisProduct(product) {
    if (product.quantity <= 1) removeProduct(product);
    else removeQuantity(product);
  }

  async function goToPayment(event) {
    event.preventDefault();
    const { name, email, city, streetAddress, country } = form;
    if (!name || !email || !city || !streetAddress || !country || !cartProducts.length) {
      toast.error("Please fill in all required details");
      return;
    }
    if (isPaying) return;
    setIsPaying(true);
    try {
      // Only ids and quantities are sent; the server prices the order from the
      // database, so nothing here can influence what the customer is charged.
      const response = await axios.post("/api/checkout", {
        ...form,
        cartProducts: cartProducts.map(({ _id, quantity }) => ({ _id, quantity })),
      });
      if (response.data.url) {
        window.location = response.data.url;
        return;
      }
      toast.error("Your order has not been processed. Please try again.");
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Your order has not been processed. Please try again.");
    }
    setIsPaying(false);
  }

  const total = cartProducts.reduce((sum, p) => sum + p.price * p.quantity || 0, 0);

  if (isSuccess) {
    return (
      <Center className="py-10">
        <Panel className="mx-auto max-w-2xl text-center">
          <h1 className="mb-2 text-2xl font-semibold md:text-3xl">Thanks for your order!</h1>
          <p className="text-lg text-fg-muted">We don&apos;t take it for granted that you chose to shop with us.</p>
          <p className="mt-2 text-fg-muted">We&apos;ll email you when your order ships.</p>
          <Link href="/products" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-on-accent hover:bg-accent-hover">
            Continue shopping
          </Link>
        </Panel>
      </Center>
    );
  }

  return (
    <Center className="py-8 md:py-10">
      {!cartReady ? (
        <CartSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]">
          <Panel>
            <h1 className="mb-4 text-2xl font-semibold">Cart</h1>

            {!cartProducts.length && (
              <div className="py-6 text-center">
                <p className="mb-4 text-fg-muted">Your cart is empty.</p>
                <Link href="/products" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-on-accent hover:bg-accent-hover">
                  Browse products
                </Link>
              </div>
            )}

            {cartProducts.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="pr-3">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line md:h-20 md:w-20">
                            <ProductImage src={product.images?.[0]} alt={product.title} sizes="80px" padding="p-1" />
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="pr-3">
                        {/* 44px steppers, spaced apart, labelled for screen
                            readers — a bare "+" or "−" says nothing about which
                            product it affects. */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={stepperClass}
                            aria-label={product.quantity < 2 ? `Remove ${product.title} from cart` : `Decrease quantity of ${product.title}`}
                            onClick={() => lessOfThisProduct(product)}
                          >
                            {product.quantity < 2 ? <DeleteIcon /> : "−"}
                          </button>
                          <span className="min-w-6 text-center tabular-nums" aria-live="polite">{product.quantity}</span>
                          <button
                            type="button"
                            className={stepperClass}
                            aria-label={`Increase quantity of ${product.title}`}
                            onClick={() => addProduct(product)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-right tabular-nums">Kshs.&nbsp;{product.quantity * product.price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="font-semibold">Total</td>
                    <td className="whitespace-nowrap text-right text-lg font-semibold tabular-nums">Kshs.&nbsp;{total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Panel>

          {cartProducts.length > 0 && (
            <Panel>
              <h2 className="mb-4 text-xl font-semibold">Order information</h2>
              <form onSubmit={goToPayment} noValidate className="grid grid-cols-2 gap-x-3">
                {FIELDS.map((field) => (
                  <div key={field.name} className={field.half ? "col-span-1" : "col-span-2"}>
                    <label htmlFor={`checkout-${field.name}`} className="mb-1 block text-sm font-medium text-fg-muted">
                      {field.label}
                      {field.optional && <span className="font-normal"> (optional)</span>}
                    </label>
                    <Input
                      id={`checkout-${field.name}`}
                      name={field.name}
                      type={field.type ?? "text"}
                      autoComplete={field.autoComplete}
                      required={!field.optional}
                      value={form[field.name]}
                      onChange={(ev) => setForm((f) => ({ ...f, [field.name]: ev.target.value }))}
                    />
                  </div>
                ))}
                <div className="col-span-2 mt-2">
                  <Button type="submit" variant="strong" block disabled={isPaying}>
                    {isPaying ? "Redirecting to payment…" : "Continue to payment"}
                  </Button>
                </div>
              </form>
            </Panel>
          )}
        </div>
      )}
    </Center>
  );
}
