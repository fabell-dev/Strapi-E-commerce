import { fetchAllProducts } from "@/lib/Strapi/Data/product-data";

import { MainSectionClient } from "../MainSectionClient";

const { STRAPI_HOST } = process.env;

export default async function MainSection() {
  const products = await fetchAllProducts();

  return <MainSectionClient products={products} strapiHost={STRAPI_HOST} />;
}
