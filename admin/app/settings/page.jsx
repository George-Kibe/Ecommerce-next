import connect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Order } from "@/models/Order";
import requireAdmin from "@/lib/requireAdmin";

// Read the allowlist directly rather than importing @/lib/auth, which would
// pull the whole Auth.js stack into this page's bundle.
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

async function getStats() {
  await connect();
  const [products, categories, orders, paidOrders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ paid: true }),
  ]);
  return { products, categories, orders, paidOrders };
}

export const metadata = { title: "Settings — Admin" };
// Counts must reflect the database at request time, not at build time.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Exposes store totals and the administrator allowlist.
  await requireAdmin();
  const stats = await getStats();

  const cards = [
    { label: "Products", value: stats.products },
    { label: "Categories", value: stats.categories },
    { label: "Orders", value: stats.orders },
    { label: "Paid orders", value: stats.paidOrders },
  ];

  return (
    <div className="w-full h-full p-4 text-blue-900 overflow-y-auto">
      <h1 className="mb-4 font-semibold text-xl">Settings</h1>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Store overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-gray-300 bg-white p-4"
            >
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Administrators</h2>
        <p className="text-sm text-gray-600 mb-2">
          Configured via the <code>ADMIN_EMAILS</code> environment variable.
          Changing it requires a redeploy.
        </p>
        <ul className="list-disc pl-6">
          {adminEmails.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
