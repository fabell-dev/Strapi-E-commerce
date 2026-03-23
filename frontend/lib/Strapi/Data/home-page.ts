import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const STRAPI_HOST =
  process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_URL;

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
        return DEFAULT_HOME_PAGE;
      }
      const { title, description, image } = res.data;
      const imageURL = image
        ? `${STRAPI_HOST}${image.url}`
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
