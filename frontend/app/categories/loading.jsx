import { HeadingSkeleton, LoadingRegion, ProductGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading categories…" className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <HeadingSkeleton />
      {[0, 1].map((i) => (
        <section key={i} className="mb-10 last:mb-0">
          <div className="mb-3 h-7 w-40 animate-pulse rounded-md bg-line md:mb-4" aria-hidden="true" />
          <ProductGridSkeleton count={4} />
        </section>
      ))}
    </LoadingRegion>
  );
}
