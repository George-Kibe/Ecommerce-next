import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  paid: { type: Boolean, default: false },
  // Set when the checkout session is created, then used by the Stripe webhook
  // to find this order again and mark it paid.
  stripeSessionId: { type: String, index: true },
  // Authoritative total in the smallest currency unit, computed server-side
  // from database prices — never from anything the browser sent.
  amountTotal: Number,
  currency: { type: String, default: "usd" },
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);
