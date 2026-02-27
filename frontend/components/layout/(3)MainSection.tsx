import { fetchProductInfo } from "@/lib/Strapi/Data/product-data";

import { SortSelector } from "../SortSelector";
import ProductsGrid from "../ProductsGrid";
import GridPagination from "../GridPagination";

const { STRAPI_HOST } = process.env;

export default async function MainSection() {
  const products = await fetchProductInfo();

  return (
    <>
      <div className="flex flex-col mx-40 ">
        <SortSelector className=" self-center lg:self-end lg:mr-10 mb-5 " />
        <ProductsGrid products={products} strapiHost={STRAPI_HOST} />
        <GridPagination />
      </div>
    </>
  );
}
