import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import { getImageUrl } from "@/lib/utils/image-url";

const DEFAULT_HOME_PAGE = {
  title: "Welcome to Our Store",
  description: "Hola a todos los que lean esto.",
  imageURL: "/HeroImage.png",
};

export const getHomePageInfo = unstable_cache(
  async () => {
    try {
      const res = await queryRead("home-page?populate=image");
      const { title, description, image } = res.data;
      const imageURL = image?.url
        ? getImageUrl(image.url)
        : DEFAULT_HOME_PAGE.imageURL;

      return { title, description, imageURL };
    } catch (error) {
      console.warn("Error fetching home page info, using default values:");
      return DEFAULT_HOME_PAGE;
    }
  },
  ["home-page"],
  { revalidate: 3600 },
);
