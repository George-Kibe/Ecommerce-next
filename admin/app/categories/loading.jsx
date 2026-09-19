import { FormSkeleton, HeaderSkeleton, LoadingRegion, TableSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading categories…">
      <div className="mx-auto max-w-5xl space-y-6">
        <HeaderSkeleton />
        <FormSkeleton fields={2} />
        <TableSkeleton rows={5} columns={5} />
      </div>
    </LoadingRegion>
  );
}
