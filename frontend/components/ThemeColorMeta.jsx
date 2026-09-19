"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/**
 * Keeps the browser UI colour (the mobile address bar) matched to the navbar.
 *
 * The <meta name="theme-color"> tags from `viewport` in layout.jsx follow the
 * OS scheme via media queries. That's right for the default System theme, but
 * someone who picks Dark on a light-mode phone would otherwise get a white
 * address bar above a dark navbar. This overrides both tags with the colour
 * for the theme actually in use.
 */
export default function ThemeColorMeta({ light, dark }) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return
    const color = resolvedTheme === "dark" ? dark : light
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", color))
  }, [resolvedTheme, light, dark])

  return null
}
