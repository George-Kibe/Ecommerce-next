/**
 * Loading skeletons shaped like each admin screen. They replace a full-screen
 * spinner, so the layout doesn't jump when data arrives. `animate-pulse` is
 * paused by the Reduce Motion rule in globals.css.
 */
const Bone = ({ className = "" }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-md bg-line ${className}`} />
)

export function LoadingRegion({ label, children }) {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-6xl">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function HeaderSkeleton({ withAction = false }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3" aria-hidden="true">
      <div className="space-y-2">
        <Bone className="h-8 w-48" />
        <Bone className="h-4 w-64" />
      </div>
      {withAction && <Bone className="h-11 w-32" />}
    </div>
  )
}

export function TableSkeleton({ rows = 6, columns = 5, withThumb = false }) {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex gap-4 bg-surface-muted px-4 py-3">
        {Array.from({ length: columns }, (_, i) => <Bone key={i} className="h-3 flex-1" />)}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4 border-t border-divider px-4 py-3">
          {withThumb && <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-line/60" />}
          {Array.from({ length: columns - (withThumb ? 1 : 0) }, (_, c) => (
            <Bone key={c} className={`h-4 flex-1 ${c === 0 ? "max-w-[40%]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 4 }) {
  return (
    <div aria-hidden="true" className="rounded-xl border border-line bg-surface p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className={`space-y-2 ${i === 0 || i === fields - 1 ? "sm:col-span-2" : ""}`}>
            <Bone className="h-3 w-24" />
            <Bone className={i === fields - 1 ? "h-28 w-full" : "h-11 w-full"} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 4, className = "grid-cols-1 sm:grid-cols-2" }) {
  return (
    <div aria-hidden="true" className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-line" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
