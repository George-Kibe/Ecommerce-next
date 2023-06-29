import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.STRIPE_SK);

async function handler(req,res) {
  const body = await req.json()
  const {name,email,city,postalCode,streetAddress,country,cartProducts} = body;
  await connect();

  let line_items = [];
  for (const product of cartProducts) {
    if (product.quantity > 0 ) {
      line_items.push({
        quantity:product.quantity,
        price_data: {
          currency: 'USD',
          product_data: {name:product.title},
          unit_amount: product.quantity * product.price * 100,
        },
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,name,email,city,postalCode,
    streetAddress,country,paid:false,
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    success_url: process.env.PUBLIC_URL + '/cart?success=1',
    cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString(),test:'ok'},
  });

  return new NextResponse("Order has been Created", {status: 201})
}

export {handler as POST};

