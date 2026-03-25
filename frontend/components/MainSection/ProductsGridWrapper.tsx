import { Suspense } from "react";
import ProductsGridServer from "./ProductsGridServer";
import { SkeletonProductsGrid } from "./SkeletonProductCard";
import { ProductGridItem } from "@/types/product.types";

interface ProductsGridWrapperProps {
  products: ProductGridItem[];
  strapiHost?: string;
}

export default function ProductsGridWrapper({
  products,
  strapiHost,
}: ProductsGridWrapperProps) {
  return (
    <Suspense fallback={<SkeletonProductsGrid pageSize={products.length} />}>
      <ProductsGridServer products={products} strapiHost={strapiHost} />
    </Suspense>
  );
}
