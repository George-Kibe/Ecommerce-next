/**
 * Shared admin UI primitives, all on the theme tokens so every page looks the
 * same in both themes. Controls are at least 44px tall (HIG minimum target).
 */

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"

export const buttonClass = {
  primary: `${base} bg-accent text-on-accent hover:bg-accent-hover`,
  secondary: `${base} border border-field-line bg-surface text-fg hover:bg-hover`,
  // Destructive actions only (HIG: red is reserved for them, never primary).
  danger: `${base} bg-danger-solid text-on-danger-solid hover:bg-danger-solid-hover`,
}

export const inputClass =
  "min-h-11 w-full rounded-md border border-field-line bg-field px-3 text-fg"

export const labelClass = "mb-1 block text-sm font-medium text-fg-muted"

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-fg md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = "" }) {
  return (
    <section className={`rounded-xl border border-line bg-surface p-4 md:p-6 ${className}`}>
      {children}
    </section>
  )
}

/**
 * Horizontally scrollable table on a card surface. Wide tables scroll inside
 * the card on phones rather than being clipped or pushing the page sideways.
 */
export function TableShell({ children, minWidth = "40rem" }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-line bg-surface">
      <table
        style={{ minWidth }}
        className="w-full border-collapse text-left text-sm [&_td]:border-t [&_td]:border-divider [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_th]:bg-surface-muted [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-fg-subtle"
      >
        {children}
      </table>
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="rounded-xl border border-dashed border-field-line bg-surface p-10 text-center">
      <p className="mb-1 font-semibold text-fg">{title}</p>
      {children && <div className="text-fg-muted">{children}</div>}
    </div>
  )
}
