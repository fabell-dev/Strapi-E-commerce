import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const STRAPI_HOST =
  process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_URL || "";

if (!STRAPI_HOST) {
  console.warn("[page-metadata] STRAPI_HOST not configured, images may not load");
}

// Helper para construir URLs de imágenes
function getImageUrl(url: string | undefined): string {
  if (!url) return DEFAULT_PAGE_INFO.logo;
  // Si ya es una URL absoluta, retornarla tal cual
  if (url.startsWith("http")) return url;
  // Si es relativa, concatenar con STRAPI_HOST
  return STRAPI_HOST ? `${STRAPI_HOST}${url}` : DEFAULT_PAGE_INFO.logo;
}

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
        console.warn("[page-metadata] No page-info data received from Strapi");
        return DEFAULT_PAGE_INFO;
      }
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      const logo = Page_Logo?.url ? getImageUrl(Page_Logo.url) : DEFAULT_PAGE_INFO.logo;
      return { Page_Title, Page_Description, logo };
    } catch (error) {
      console.error("[page-metadata] Error fetching page info:", error);
      return DEFAULT_PAGE_INFO;
    }
  },
  ["page-info"],
  { revalidate: 3600 },
);
