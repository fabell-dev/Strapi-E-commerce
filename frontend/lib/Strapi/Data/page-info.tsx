import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const { STRAPI_HOST } = process.env;

export const getPageInfo = unstable_cache(
  async () => {
    return queryRead("page-info?populate=Page_Logo").then((res) => {
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      const logo = `${STRAPI_HOST}${Page_Logo.url}`;
      return { Page_Title, Page_Description, logo };
    });
  },
  ["page-info"],
  { revalidate: 3600 },
);
