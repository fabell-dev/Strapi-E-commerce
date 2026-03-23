import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const STRAPI_HOST =
  process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_URL;

// Valores por defecto si Strapi no está disponible
const DEFAULT_PAGE_INFO = {
  Page_Title: "E-Commerce Store",
  Page_Description: "Welcome to our store",
  logo: "/logo.png",
};

export const getPageInfo = unstable_cache(
  async () => {
    try {
      const res = await queryRead("page-info?populate=Page_Logo");
      if (!res.data) {
        console.warn(
          "No data returned from page-info endpoint, using defaults",
        );
        return DEFAULT_PAGE_INFO;
      }
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      const logo = Page_Logo
        ? `${STRAPI_HOST}${Page_Logo.url}`
        : DEFAULT_PAGE_INFO.logo;
      return { Page_Title, Page_Description, logo };
    } catch (error) {
      console.warn("Error fetching page info, using default values:", error);
      return DEFAULT_PAGE_INFO;
    }
  },
  ["page-info"],
  { revalidate: 3600 },
);
