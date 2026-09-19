"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useTheme } from "next-themes"

const SunIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MonitorIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
]

/**
 * Theme picker: a button in the navbar that opens a small menu of
 * Light / Dark / System.
 *
 * A menu rather than a two-state switch because "System" matters — it's the
 * default, and it keeps following the device (e.g. automatic dark mode at
 * sunset). Each option has a text label as well as an icon, since a monitor
 * glyph alone doesn't say "follow my device".
 *
 * Keyboard: Enter/Space/↓ opens and focuses the current choice; ↑/↓, Home and
 * End move; Enter selects; Escape closes and returns focus to the button.
 */
export default function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])
  const menuId = useId()

  const selectedIndex = Math.max(0, OPTIONS.findIndex((o) => o.value === theme))

  // Close when clicking or tapping anywhere outside the control.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // On open, move focus to the current choice so the menu is immediately
  // usable from the keyboard and screen readers start on the active option.
  useEffect(() => {
    if (open) itemRefs.current[selectedIndex]?.focus()
  }, [open, selectedIndex])

  const close = ({ restoreFocus = true } = {}) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const choose = (option) => {
    setTheme(option.value)
    setAnnouncement(
      option.value === "system"
        ? `Theme follows your device${systemTheme ? `, currently ${systemTheme}` : ""}`
        : `${option.label} theme on`
    )
    close()
  }

  const onTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onMenuKeyDown = (event) => {
    const count = OPTIONS.length
    const current = itemRefs.current.indexOf(document.activeElement)
    const focusAt = (i) => itemRefs.current[(i + count) % count]?.focus()

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        focusAt(current + 1)
        break
      case "ArrowUp":
        event.preventDefault()
        focusAt(current - 1)
        break
      case "Home":
        event.preventDefault()
        focusAt(0)
        break
      case "End":
        event.preventDefault()
        focusAt(count - 1)
        break
      case "Escape":
        event.preventDefault()
        close()
        break
      case "Tab":
        // Let focus move on naturally; just don't leave the menu hanging open.
        close({ restoreFocus: false })
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Colour theme"
        title="Colour theme"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-chrome-fg transition-colors hover:bg-hover hover:text-chrome-fg-strong"
      >
        {/* The visible icon is chosen by CSS from data-theme, so it's correct on
            first paint — before React knows the stored preference. */}
        <SunIcon className="theme-icon-light h-5 w-5" />
        <MoonIcon className="theme-icon-dark h-5 w-5" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Colour theme"
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 text-fg shadow-lg"
        >
          {OPTIONS.map((option, index) => {
            const { value, label, Icon } = option
            const checked = theme === value
            return (
              <button
                key={value}
                ref={(el) => (itemRefs.current[index] = el)}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                // Roving tabindex: only the current item is in the tab order;
                // arrow keys move between the rest.
                tabIndex={index === selectedIndex ? 0 : -1}
                onClick={() => choose(option)}
                className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm hover:bg-hover focus-visible:bg-hover focus-visible:outline-offset-[-3px] ${
                  checked ? "font-semibold" : ""
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">
                  {label}
                  {value === "system" && systemTheme && (
                    // Show what "System" resolves to right now, so the choice
                    // isn't a mystery.
                    <span className="block text-xs font-normal text-fg-muted">
                      Device is using {systemTheme}
                    </span>
                  )}
                </span>
                {checked && <CheckIcon className="h-4 w-4 shrink-0 text-link" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Confirms the change to screen-reader users, who don't see the repaint. */}
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
