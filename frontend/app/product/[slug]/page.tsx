import { fetchProductBySlug } from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import { Product } from "@/types/product.types";
import ProductLayoutClient from "@/components/ProductLayoutClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product: Product | null = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductLayoutClient product={product} />
    </>
  );
}
