import { fetchProducts } from "@/lib/Strapi/Data/product-data";
import { MainSectionClient } from "./MainSectionClient";
import { redirect } from "next/navigation";

const STRAPI_HOST = process.env.STRAPI_HOST;

export default async function MainSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;

  if (!params.page || !params.pageSize) {
    redirect("?page=1&pageSize=9");
  }

  const page = parseInt(
    Array.isArray(params.page) ? params.page[0] : params.page,
  );
  const pageSize = parseInt(
    Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize,
  );

  const { data: products, pagination } = await fetchProducts(page, pageSize);

  return (
    <MainSectionClient
      pagination={pagination}
      products={products}
      strapiHost={STRAPI_HOST}
    />
  );
}
