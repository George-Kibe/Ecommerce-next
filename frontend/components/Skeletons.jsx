/**
 * Loading skeletons shaped like the real content.
 *
 * These replace a full-screen spinner. A skeleton that matches the layout lets
 * people see where things will appear, and the page doesn't jump when data
 * lands. Server components — no client JavaScript needed to show them.
 *
 * `animate-pulse` is paused by the Reduce Motion rule in globals.css.
 */

const Bone = ({ className = "" }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-md bg-line ${className}`} />
)

/** Wrapper that tells assistive tech something is loading. */
export function LoadingRegion({ label, children, className = "" }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface">
      <div className="aspect-square w-full animate-pulse bg-line/60" />
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Bone className="h-4 w-4/5" />
        <Bone className="h-4 w-2/5" />
        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Bone className="h-5 w-20" />
          <Bone className="h-11 w-full sm:w-28" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}

export function HeadingSkeleton({ className = "" }) {
  return <Bone className={`mx-auto mb-4 h-8 w-48 md:mb-6 md:h-9 ${className}`} />
}

export function HeroSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
      <div className="order-1 aspect-[4/3] w-full animate-pulse rounded-lg bg-line/60 md:order-2" />
      <div className="order-2 space-y-4 md:order-1">
        <Bone className="h-9 w-3/4 md:h-11" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <div className="flex gap-3 pt-2">
          <Bone className="h-11 w-28" />
          <Bone className="h-11 w-36" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[2fr_3fr] md:gap-10 md:px-8 md:py-10">
      <div className="rounded-xl border border-line bg-surface-muted p-4 md:p-6">
        <div className="aspect-[4/3] w-full animate-pulse rounded-md bg-line/60" />
        <div className="mt-3 flex gap-2">
          {[0, 1, 2].map((i) => <Bone key={i} className="h-16 w-16" />)}
        </div>
      </div>
      <div className="space-y-4">
        <Bone className="h-9 w-2/3" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-3/5" />
        <div className="flex items-center gap-5 pt-2">
          <Bone className="h-7 w-32" />
          <Bone className="h-11 w-36" />
        </div>
      </div>
    </div>
  )
}
