import { HeaderSkeleton, LoadingRegion, TableSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading orders…">
      <HeaderSkeleton />
      <TableSkeleton rows={8} columns={4} />
    </LoadingRegion>
  );
}
