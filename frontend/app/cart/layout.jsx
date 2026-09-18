/**
 * The cart page itself is a client component, so it can't export metadata.
 * This layout carries it.
 *
 * noindex here backs up the robots.txt disallow: a blocked URL can still be
 * indexed from external links, and only a meta robots tag reliably keeps it
 * out of results.
 */
export const metadata = {
  title: "Your Cart",
  description: "Review the items in your cart and check out securely.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartLayout({ children }) {
  return children;
}
