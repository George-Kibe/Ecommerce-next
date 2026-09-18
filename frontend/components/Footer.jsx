import React from 'react'
import Link from "next/link"
import { BRAND } from '@/lib/brand'

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/cart", label: "Cart" },
]

const Footer = () => {
  return (
    <footer className="mt-8 w-full border-t border-chrome-line bg-chrome text-chrome-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        {/* The year was hardcoded to 2023 — it now tracks the render year. */}
        <p className="text-base">
          © {new Date().getFullYear()}{" "}
          <Link href="/" className="text-chrome-fg-strong hover:underline">{BRAND.name}</Link>.
          All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base font-medium">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-chrome-fg-strong hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
