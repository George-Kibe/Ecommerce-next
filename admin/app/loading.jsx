import { CardGridSkeleton, HeaderSkeleton, LoadingRegion } from "@/components/Skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading dashboard…">
      <HeaderSkeleton />
      <CardGridSkeleton count={4} />
    </LoadingRegion>
  );
}
