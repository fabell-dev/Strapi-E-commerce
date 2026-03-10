import { fetchProducts } from "@/lib/Strapi/Data/product-data";
import { MainSectionClient } from "./MainSectionClient";

const STRAPI_HOST = process.env.STRAPI_HOST;

export default async function MainSection() {
  const products = await fetchProducts();

  return <MainSectionClient products={products} strapiHost={STRAPI_HOST} />;
}
