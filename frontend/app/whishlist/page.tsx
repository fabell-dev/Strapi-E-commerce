import { MainSectionClient } from "@/components/MainSection/MainSectionClient";
import { redirect } from "next/navigation";
import { fetchProducts } from "@/lib/Strapi/Data/product-data";

const STRAPI_HOST = process.env.STRAPI_HOST;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const paramsPagination = await searchParams;
  if (!paramsPagination.page || !paramsPagination.pageSize) {
    redirect("?page=1&pageSize=9");
  }
  const paramData = await searchParams;
  const page = parseInt(
    Array.isArray(paramData.page) ? paramData.page[0] : paramData.page || "1",
  );
  const pageSize = parseInt(
    Array.isArray(paramData.pageSize)
      ? paramData.pageSize[0]
      : paramData.pageSize || "12",
  );

  const { data: productsByCategory, pagination } = await fetchProducts(
    page,
    pageSize,
  );

  return (
    <MainSectionClient
      pagination={pagination}
      products={productsByCategory}
      strapiHost={STRAPI_HOST}
    />
  );
}
