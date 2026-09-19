"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  DashboardIcon, ProductsIcon, CategoriesIcon, OrdersIcon, SettingsIcon, LogoutIcon,
} from "@/components/icons"

const LINKS = [
  { href: "/", label: "Dashboard", Icon: DashboardIcon },
  { href: "/products", label: "Products", Icon: ProductsIcon },
  { href: "/categories", label: "Categories", Icon: CategoriesIcon },
  { href: "/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
]

const itemClass =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors"

/**
 * Sidebar navigation. Rendered inside the desktop sidebar and the mobile
 * drawer (see AdminShell); `onNavigate` lets the drawer close after a tap.
 */
export default function Navbar({ onNavigate }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-3">
      <ul className="flex flex-col gap-1">
        {LINKS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`${itemClass} ${
                  active
                    ? "bg-accent-soft font-semibold text-on-accent-soft"
                    : "text-chrome-fg hover:bg-hover hover:text-chrome-fg-strong"
                }`}
              >
                <Icon />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto border-t border-chrome-line pt-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${itemClass} text-chrome-fg hover:bg-hover hover:text-chrome-fg-strong`}
        >
          <LogoutIcon />
          Log out
        </button>
      </div>
    </nav>
  )
}
