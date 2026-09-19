import { FormSkeleton, HeaderSkeleton, LoadingRegion } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading product form…">
      <div className="mx-auto max-w-3xl space-y-6">
        <HeaderSkeleton />
        <FormSkeleton fields={5} />
        <FormSkeleton fields={2} />
      </div>
    </LoadingRegion>
  );
}
