import Link from "next/link";
import { auth, adminEmails, adminAccessConfigured } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import SignInButton from "@/components/SignInButton";
import { ProductsIcon, CategoriesIcon, OrdersIcon, SettingsIcon } from "@/components/icons";

const SHORTCUTS = [
  { href: "/products", label: "Products", hint: "Add, edit and remove products", Icon: ProductsIcon },
  { href: "/categories", label: "Categories", hint: "Organise products and their properties", Icon: CategoriesIcon },
  { href: "/orders", label: "Orders", hint: "Review orders and payment status", Icon: OrdersIcon },
  { href: "/settings", label: "Settings", hint: "Store overview and administrators", Icon: SettingsIcon },
];

/*
  Server component: the session is known before render, so there's no
  "Loading…" flash while the client checks it (the old version showed one on
  every visit).
*/
export default async function Home() {
  const session = await auth();
  const isAdmin = adminEmails.includes(session?.user?.email?.toLowerCase());

  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 text-center shadow-sm">
          <h1 className="mb-1 text-2xl font-semibold text-fg">Sign in</h1>
          <p className="mb-6 text-fg-muted">to manage {BRAND.name}</p>
          {adminAccessConfigured ? (
            <SignInButton />
          ) : (
            // Without this, signing in bounces straight back from Google with
            // no explanation, which looks like a broken login.
            <p role="alert" className="rounded-lg border border-danger p-3 text-sm text-danger">
              Admin access isn&apos;t configured yet. Set <code>ADMIN_EMAILS</code> in the
              deployment environment and redeploy.
            </p>
          )}
          <p className="mt-4 text-balance text-sm text-fg-muted">Only approved administrator accounts can sign in.</p>
        </div>
      </div>
    );
  }

  const firstName = session.user.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-semibold text-fg md:text-3xl">
        Hello{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mb-6 text-fg-muted">What would you like to do?</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SHORTCUTS.map(({ href, label, hint, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-full items-start gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-link hover:bg-hover"
            >
              <span className="rounded-lg bg-accent-soft p-2 text-on-accent-soft"><Icon className="h-6 w-6" /></span>
              <span>
                <span className="block font-semibold text-fg">{label}</span>
                <span className="block text-sm text-fg-muted">{hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
