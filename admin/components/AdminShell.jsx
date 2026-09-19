"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import ThemeToggle from "@/components/ThemeToggle"
import { MenuIcon, CloseIcon } from "@/components/icons"
import { BRAND } from "@/lib/brand"

/**
 * App frame: top bar + sidebar + content.
 *
 * - Desktop (md+): the sidebar is always visible. It used to be hidden until
 *   the hamburger was clicked at every screen size.
 * - Mobile: the sidebar is a slide-in drawer with a backdrop. Escape, the
 *   backdrop, the close button and choosing a link all close it.
 * - `isAdmin` comes from the server (layout.jsx), so the sidebar is right on
 *   first paint instead of popping in after a client-side session check.
 * - The content column keeps `min-w-0`: without it a flex child's
 *   `min-width: auto` let wide tables push past the screen and get clipped.
 */
export default function AdminShell({ isAdmin, user, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const close = () => setDrawerOpen(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false)
    document.addEventListener("keydown", onKey)
    // Stop the page behind the drawer from scrolling.
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-chrome-line bg-chrome text-chrome-fg">
        <div className="flex h-14 items-center gap-2 px-3 md:px-5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              aria-controls="admin-drawer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-hover hover:text-chrome-fg-strong md:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 text-chrome-fg-strong">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: BRAND.color }}
            >
              {BRAND.monogram}
            </span>
            <span className="text-lg font-semibold whitespace-nowrap">{BRAND.name}</span>
            <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold text-on-accent-soft">
              Admin
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            {isAdmin && user?.image && (
              <Image
                src={user.image}
                alt=""
                width={32}
                height={32}
                className="ml-1 hidden rounded-full sm:block"
              />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {isAdmin && (
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-chrome-line bg-chrome md:block">
            <Navbar />
          </aside>
        )}

        {isAdmin && drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden" id="admin-drawer" role="dialog" aria-modal="true" aria-label="Navigation">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={close}
              className="absolute inset-0 h-full w-full cursor-default bg-black/50"
            />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-chrome-line bg-chrome shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-chrome-line px-3">
                <span className="font-semibold text-chrome-fg-strong">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation"
                  autoFocus
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-chrome-fg hover:bg-hover"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Navbar onNavigate={close} />
              </div>
            </div>
          </div>
        )}

        <main id="main" className="min-w-0 flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
