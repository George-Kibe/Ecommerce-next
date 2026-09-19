import { FormSkeleton, LoadingRegion } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading…">
      <div className="mx-auto max-w-lg"><FormSkeleton fields={2} /></div>
    </LoadingRegion>
  );
}
