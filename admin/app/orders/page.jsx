import connect from "@/lib/db";
import { Order } from "@/models/Order";
import requireAdmin from "@/lib/requireAdmin";
import { EmptyState, PageHeader, TableShell } from "@/components/ui";

async function getAllOrders() {
  await connect();
  const response = await Order.find().sort({ createdAt: -1 }).limit(200);
  return JSON.parse(JSON.stringify(response));
}

export const metadata = { title: "Orders" };
// Orders change constantly; never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // Orders contain customer names, emails and addresses.
  await requireAdmin();
  const orders = await getAllOrders();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Orders"
        description={orders.length ? `Latest ${orders.length} order${orders.length === 1 ? "" : "s"}, newest first` : undefined}
      />

      {orders.length === 0 ? (
        <EmptyState title="No orders yet">Orders appear here as soon as a customer checks out.</EmptyState>
      ) : (
        <TableShell minWidth="48rem">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment</th>
              <th>Customer</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="align-top hover:bg-hover">
                <td className="whitespace-nowrap text-fg-muted">
                  {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </td>
                {/*
                  State carried by shape and word as well as colour (HIG: red and
                  green are the hardest pair to tell apart). Colours are theme
                  tokens, contrast-checked on the table surface in both themes.
                */}
                <td>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    order.paid ? "border-success text-success" : "border-danger text-danger"
                  }`}>
                    <span aria-hidden="true">{order.paid ? "✓" : "✕"}</span>
                    {order.paid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td>
                  <span className="block font-medium text-fg">{order.name}</span>
                  <span className="block text-fg-muted">{order.email}</span>
                  <span className="block text-fg-muted">
                    {[order.streetAddress, order.city, order.postalCode, order.country].filter(Boolean).join(", ")}
                  </span>
                </td>
                <td className="text-fg">
                  {/* line_items can be absent on older or partial orders */}
                  {Array.isArray(order.line_items) && order.line_items.length > 0 ? (
                    <ul className="space-y-0.5">
                      {order.line_items.map((line, index) => (
                        <li key={index}>
                          {line?.price_data?.product_data?.name ?? "Unknown item"}{" "}
                          <span className="text-fg-muted">× {line?.quantity ?? 0}</span>
                        </li>
                      ))}
                    </ul>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
