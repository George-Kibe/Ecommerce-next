import connect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Order } from "@/models/Order";
import requireAdmin from "@/lib/requireAdmin";
import { Card, PageHeader } from "@/components/ui";

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

export const metadata = { title: "Settings" };
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
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Settings" description="Store overview and who can manage it." />

      <section aria-labelledby="overview-heading" className="mb-8">
        <h2 id="overview-heading" className="mb-3 text-lg font-semibold text-fg">Store overview</h2>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-line bg-surface p-4">
              <dt className="text-sm text-fg-muted">{card.label}</dt>
              <dd className="mt-1 text-3xl font-semibold tabular-nums text-fg">{card.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Card>
        <h2 className="mb-1 text-lg font-semibold text-fg">Administrators</h2>
        <p className="mb-3 text-sm text-fg-muted">
          Configured with the <code className="rounded bg-surface-muted px-1 py-0.5 text-fg">ADMIN_EMAILS</code> environment
          variable. Changing it requires a redeploy.
        </p>
        <ul className="divide-y divide-divider">
          {adminEmails.map((email) => (
            <li key={email} className="py-2 text-fg">{email}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
