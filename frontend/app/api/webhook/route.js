import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import connect from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SK);

// Signature verification needs the exact bytes Stripe sent, so this handler
// must read the raw body rather than parsed JSON.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    // An invalid signature means the request did not come from Stripe.
    console.error("[webhook] signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (session.payment_status === "paid" && orderId) {
        await connect();
        // Matching on both id and session id means a leaked order id alone is
        // not enough to mark an order paid.
        await Order.updateOne(
          { _id: orderId, stripeSessionId: session.id },
          { $set: { paid: true } }
        );
      }
    }
  } catch (error) {
    // Return 500 so Stripe retries rather than dropping the event.
    console.error("[webhook] failed to process event:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
