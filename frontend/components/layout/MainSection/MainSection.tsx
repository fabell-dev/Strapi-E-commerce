import { fetchProducts } from "@/lib/Strapi/Data/product-data";
import { MainSectionClient } from "./MainSectionClient";
import { redirect } from "next/navigation";

const STRAPI_HOST = process.env.STRAPI_HOST;

export default async function MainSection({
  searchParams,
}: {
  searchParams: any;
}) {
  const params = await searchParams;

  if (!params.page || !params.pageSize) {
    redirect("?page=1&pageSize=12");
  }

  const page = parseInt(params.page);
  const pageSize = parseInt(params.pageSize);

  const { data: products, pagination } = await fetchProducts(page, pageSize);

  return (
    <MainSectionClient
      pagination={pagination}
      products={products}
      strapiHost={STRAPI_HOST}
    />
  );
}
