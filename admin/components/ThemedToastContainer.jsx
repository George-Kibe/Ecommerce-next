"use client"

import { ToastContainer } from "react-toastify"
import { useTheme } from "next-themes"

/**
 * One toast container for the whole app, matched to the active theme — a
 * bright white toast popping up over a dark page is jarring.
 *
 * resolvedTheme is undefined during SSR; no toasts render then, so falling
 * back to "light" can't cause a visible mismatch.
 */
export default function ThemedToastContainer() {
  const { resolvedTheme } = useTheme()
  return (
    <ToastContainer
      position="bottom-right"
      newestOnTop
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}
