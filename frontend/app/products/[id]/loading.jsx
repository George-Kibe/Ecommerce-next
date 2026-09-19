import { LoadingRegion, ProductDetailSkeleton } from "@/components/Skeletons";

// Without this the product page inherited the products-grid skeleton, which is
// the wrong shape for a single product.
export default function Loading() {
  return (
    <LoadingRegion label="Loading product…">
      <ProductDetailSkeleton />
    </LoadingRegion>
  );
}
