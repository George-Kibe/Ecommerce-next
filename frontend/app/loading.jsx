import { HeroSkeleton, HeadingSkeleton, LoadingRegion, ProductGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading the store…">
      <HeroSkeleton />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <HeadingSkeleton />
        <ProductGridSkeleton count={8} />
      </div>
    </LoadingRegion>
  );
}
