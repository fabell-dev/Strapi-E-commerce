import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import { log } from "console";

const { STRAPI_HOST } = process.env;

export const fetchProductInfo = unstable_cache(
  async () => {
    return queryRead("product-categories").then((res) => {
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      //   const logo = `${STRAPI_HOST}${Page_Logo.url}`;
      return res.data;
    });
  },
  ["product"],
  { revalidate: 60 },
);

export async function getProductCategories() {
  const data = await fetchProductInfo();
  const categories = data.map((item: any) => item.name);

  return categories;
}
