import Stripe from "stripe";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import Product from "@/models/Product";
import connect from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SK);

const CURRENCY = "usd";
const MAX_QUANTITY_PER_LINE = 100;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, city, postalCode, streetAddress, country, cartProducts } =
    body ?? {};

  // --- Validate the customer details -------------------------------------
  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(city) ||
    !isNonEmptyString(streetAddress) ||
    !isNonEmptyString(country)
  ) {
    return NextResponse.json(
      { error: "Missing required order details" },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // --- Normalise the cart into id -> quantity ----------------------------
  // Only the ids and quantities are taken from the request. Prices are looked
  // up from the database below, so a tampered request cannot set its own price.
  const quantitiesById = new Map();
  for (const item of cartProducts) {
    const id = item?._id;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Cart contains an invalid product" },
        { status: 400 }
      );
    }
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) continue;
    if (quantity > MAX_QUANTITY_PER_LINE) {
      return NextResponse.json(
        { error: `Quantity per item is limited to ${MAX_QUANTITY_PER_LINE}` },
        { status: 400 }
      );
    }
    quantitiesById.set(String(id), (quantitiesById.get(String(id)) ?? 0) + quantity);
  }

  if (quantitiesById.size === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    await connect();

    // --- Price from the database, never from the client -------------------
    const products = await Product.find({
      _id: { $in: [...quantitiesById.keys()] },
    });

    if (products.length !== quantitiesById.size) {
      return NextResponse.json(
        { error: "Cart contains a product that no longer exists" },
        { status: 400 }
      );
    }

    const line_items = [];
    let amountTotal = 0;

    for (const product of products) {
      const quantity = quantitiesById.get(String(product._id));
      const unitAmount = Math.round(Number(product.price) * 100);

      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        return NextResponse.json(
          { error: `"${product.title}" is not available for purchase` },
          { status: 400 }
        );
      }

      amountTotal += unitAmount * quantity;
      line_items.push({
        quantity,
        price_data: {
          currency: CURRENCY,
          product_data: { name: product.title },
          // Per-unit price. Stripe multiplies by `quantity` itself — the old
          // code multiplied here as well and overcharged by a factor of the
          // quantity.
          unit_amount: unitAmount,
        },
      });
    }

    const orderDoc = await Order.create({
      line_items,
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false,
      amountTotal,
      currency: CURRENCY,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
      cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
      metadata: { orderId: orderDoc._id.toString() },
    });

    orderDoc.stripeSessionId = session.id;
    await orderDoc.save();

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    console.error("[checkout] failed to create session:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
