import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";
import { fetchProductInfo } from "@/lib/Strapi/Data/product-data";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getProductCategories } from "@/lib/Strapi/Data/product-data";
import Test from "@/components/Test";

export default async function Home() {
  const { title, description, imageURL } = await getHomePageInfo();
  const data = await fetchProductInfo();

  return (
    <>
      {/* <div className="h-screen bg-foreground "></div> */}
      <Test />
    </>
  );
}
