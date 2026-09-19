import { CardGridSkeleton, FormSkeleton, HeaderSkeleton, LoadingRegion } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading settings…">
      <div className="mx-auto max-w-5xl space-y-6">
        <HeaderSkeleton />
        <CardGridSkeleton count={4} className="grid-cols-2 md:grid-cols-4" />
        <FormSkeleton fields={2} />
      </div>
    </LoadingRegion>
  );
}
