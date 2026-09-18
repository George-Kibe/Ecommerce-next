"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Theme state for the storefront.
 *
 * - `attribute="data-theme"` matches the selectors in globals.css.
 * - `defaultTheme="system"` follows the device until the visitor picks
 *   something, and keeps following it live if they choose System.
 * - next-themes injects a tiny blocking script that sets data-theme before the
 *   first paint, so a returning dark-mode visitor never sees a white flash.
 * - `disableTransitionOnChange` suppresses CSS transitions for the instant of
 *   the switch; otherwise every element with a colour transition animates at a
 *   slightly different speed and the page visibly smears between themes.
 */
export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      {children}
    </NextThemesProvider>
  )
}
