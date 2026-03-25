import ProductsGrid from "./ProductsGrid";
import { ProductGridItem } from "@/types/product.types";

interface ProductsGridServerProps {
  products: ProductGridItem[];
  strapiHost?: string;
}

export default async function ProductsGridServer({
  products,
  strapiHost,
}: ProductsGridServerProps) {
  // Pequeño delay para permitir que el Suspense se vea
  // Esto simula que está esperando por algo
  await new Promise((resolve) => setTimeout(resolve, 800));

  return <ProductsGrid products={products} strapiHost={strapiHost} />;
}
