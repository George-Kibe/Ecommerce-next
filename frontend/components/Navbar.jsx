"use client"
import { CartContext } from '@/context/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { BRAND } from '@/lib/brand'

const LINKS = [
  { href: "/", name: "Home" },
  { href: "/products", name: "All products" },
  { href: "/categories", name: "Categories" },
  { href: "/account", name: "Account" },
  { href: "/cart", name: "Cart", showCount: true },
]

/*
  A real link (not a button with an href), with the current page marked by
  aria-current rather than colour alone.

  Home used to point at "/#", which never equals the pathname "/", so it was
  never shown as the current page. The cart count was absolutely positioned at
  a fixed offset and drifted off the label at other font sizes; it's now an
  inline pill.
*/
const NavLink = ({ href, name, count, onNavigate, block = false }) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold whitespace-nowrap transition-colors ${
        block ? "w-full" : ""
      } ${
        isActive
          ? "text-chrome-active"
          : "text-chrome-fg hover:bg-hover hover:text-chrome-fg-strong"
      }`}
    >
      <span className="text-base lg:text-lg">{name}</span>
      {count > 0 && (
        <span className="rounded-full bg-accent px-2 text-sm font-bold text-on-accent">
          <span aria-hidden="true">{count}</span>
          <span className="sr-only">{`, ${count} item${count === 1 ? "" : "s"} in cart`}</span>
        </span>
      )}
    </Link>
  )
}

const Navbar = () => {
  const [showMobileNav, setShowMobileNav] = useState(false)
  const { cartProducts } = useContext(CartContext);
  const cartCount = cartProducts.length;
  const closeMobileNav = () => setShowMobileNav(false);

  // Escape closes the mobile menu, matching the theme menu's behaviour.
  useEffect(() => {
    if (!showMobileNav) return;
    const onKey = (e) => e.key === "Escape" && setShowMobileNav(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showMobileNav]);

  return (
    <header className="bg-chrome border-b border-chrome-line text-chrome-fg shadow-lg">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2 md:px-8">
        <Link
          href="/"
          onClick={closeMobileNav}
          className="flex shrink-0 items-center py-2 text-chrome-fg-strong"
          aria-label={`${BRAND.name} home`}
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} count={link.showCount ? cartCount : 0} />
              </li>
            ))}
          </ul>

          {/* Visible at every size — the theme shouldn't be buried in a menu. */}
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setShowMobileNav((open) => !open)}
            aria-label={showMobileNav ? "Close menu" : "Open menu"}
            aria-expanded={showMobileNav}
            aria-controls="mobile-nav"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-chrome-fg hover:bg-hover hover:text-chrome-fg-strong md:hidden"
          >
            {showMobileNav ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {showMobileNav && (
        <ul id="mobile-nav" className="border-t border-chrome-line px-4 pb-3 pt-2 md:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                {...link}
                count={link.showCount ? cartCount : 0}
                onNavigate={closeMobileNav}
                block
              />
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
