import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";
const { STRAPI_HOST } = process.env;

const queryProducts = qs.stringify({
  fields: ["name", "price", "stock"],
  populate: {
    image: {
      fields: ["url", "name"],
    },
    variants: {
      fields: ["color"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
    },
  },
});

export const fetchCategrories = unstable_cache(
  async () => {
    return queryRead("product-categories").then((res) => {
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      //   const logo = `${STRAPI_HOST}${Page_Logo.url}`;
      return res.data;
    });
  },
  ["categories"],
  { revalidate: 60 },
);

export const fetchProductInfo = unstable_cache(
  async () => {
    return queryRead(`products?${queryProducts}`).then((res) => {
      return res.data;
    });
  },
  ["product"],
  { revalidate: 60 },
);

export async function getProductCategories() {
  const data = await fetchCategrories();
  const categories = data.map((item: any) => item.name);

  return categories;
}
