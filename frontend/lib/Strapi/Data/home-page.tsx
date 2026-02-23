import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";

const { STRAPI_HOST } = process.env;

export const getHomePageInfo = unstable_cache(
  async () => {
    return queryRead("home-page?populate=image").then((res) => {
      const { title, description, image } = res.data;
      const imageURL = `${STRAPI_HOST}${image.url}`;
      return { title, description, imageURL };
    });
  },
  ["home-page"],
  { revalidate: 3600 },
);
