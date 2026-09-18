import connect from "@/lib/db";
import { Order } from "@/models/Order";
import requireAdmin from "@/lib/requireAdmin";

async function getAllOrders() {
  await connect();
  const response = await Order.find().sort({ createdAt: -1 }).limit(200);
  return JSON.parse(JSON.stringify(response));
}

export const metadata = { title: "Orders — Admin" };
// Orders change constantly; never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // Orders contain customer names, emails and addresses.
  await requireAdmin();
  const orders = await getAllOrders();

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <h1 className="mb-2 font-semibold text-xl">Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.length > 0 && (
        <table className="border border-gray-400 w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-400 p-1 text-left">Date</th>
              <th className="border border-gray-400 p-1 text-left">Paid</th>
              <th className="border border-gray-400 p-1 text-left">Recipient</th>
              <th className="border border-gray-400 p-1 text-left">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-400 p-1">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                {/*
                  Payment state was red/green text only. Red-green is the
                  pairing the HIG singles out as hardest to tell apart, and
                  green-600 on white measured 3.30:1 (below the 4.5:1 minimum).
                  Now green-700, and the state is carried by a distinct shape
                  and word as well as the colour.
                */}
                <td className="border border-gray-400 p-1">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      order.paid ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    <span aria-hidden="true">{order.paid ? "✓" : "✕"}</span>
                    {order.paid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="border border-gray-400 p-1">
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td className="border border-gray-400 p-1">
                  {/* line_items can be absent on older or partial orders */}
                  {Array.isArray(order.line_items) && order.line_items.length > 0
                    ? order.line_items.map((line, index) => (
                        <span key={index} className="block">
                          {line?.price_data?.product_data?.name ?? "Unknown item"}{" "}
                          x{line?.quantity ?? 0}
                        </span>
                      ))
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
