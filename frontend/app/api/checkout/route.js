import {Order} from "@/models/Order";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.STRIPE_SK);

async function handler(req,res) {
  const body = await req.json()
  const {name,email,city,postalCode,streetAddress,country,cartProducts} = body;
  console.log(body)
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
  try {
    const orderDoc = await Order.create({
        line_items,name,email,city,postalCode,
        streetAddress,country,paid:false,
      });
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'], 
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: process.env.PUBLIC_URL + '/cart?success=1',
            cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
            metadata: {orderId:orderDoc._id.toString(),test:'ok'},
          });
          const url = JSON.stringify({"url":session.url})
          return new NextResponse(url, {status: 201})
    } catch (error) {
        console.log(error.message)
        return new NextResponse("Stripe checkout error", {status: 500})
    }
  } catch (error) {
    return new NextResponse("Order creating error", {status: 500})
  }
}

export {handler as POST};

