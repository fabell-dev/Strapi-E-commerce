import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

// Valores por defecto si Strapi no está disponible
const DEFAULT_PAGE_INFO = {
  Page_Title: "E-Commerce Store",
  Page_Description: "Welcome to our store",
};

export const getPageInfo = unstable_cache(
  async () => {
    try {
      const res = await queryRead("page-info");
      const { Page_Title, Page_Description } = res.data;
      return { Page_Title, Page_Description };
    } catch (error) {
      return DEFAULT_PAGE_INFO;
    }
  },
  ["page-info"],
  { revalidate: 3600 },
);
