import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const STRAPI_HOST =
  process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_URL || "";

if (!STRAPI_HOST) {
  console.warn("[home-page] STRAPI_HOST not configured, images may not load");
}

// Helper para construir URLs de imágenes
function getImageUrl(url: string | undefined): string {
  if (!url) return DEFAULT_HOME_PAGE.imageURL;
  // Si ya es una URL absoluta, retornarla tal cual
  if (url.startsWith("http")) return url;
  // Si es relativa, concatenar con STRAPI_HOST
  return STRAPI_HOST ? `${STRAPI_HOST}${url}` : DEFAULT_HOME_PAGE.imageURL;
}

const DEFAULT_HOME_PAGE = {
  title: "Welcome to Our Store",
  description: {
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Browse our collection" }],
        },
      ],
    },
  },
  imageURL: "/default-hero.png",
};

export const getHomePageInfo = unstable_cache(
  async () => {
    try {
      const res = await queryRead("home-page?populate=image");
      if (!res.data) {
        console.warn("[home-page] No home-page data received from Strapi");
        return DEFAULT_HOME_PAGE;
      }
      const { title, description, image } = res.data;
      const imageURL = image?.url
        ? getImageUrl(image.url)
        : DEFAULT_HOME_PAGE.imageURL;
      const parsedDescription =
        typeof description === "string" ? JSON.parse(description) : description;
      return { title, description: parsedDescription, imageURL };
    } catch (error) {
      console.warn(
        "Error fetching home page info, using default values:",
        error,
      );
      return DEFAULT_HOME_PAGE;
    }
  },
  ["home-page"],
  { revalidate: 60 },
);
