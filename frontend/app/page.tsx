import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";
import { fetchProductInfo } from "@/lib/Strapi/Data/product-data";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import GridPagination from "@/components/GridPagination";
import { SortSelector } from "@/components/SortSelector";

const { STRAPI_HOST } = process.env;

export default async function Home() {
  const pageInfo = await getHomePageInfo();
  const products = await fetchProductInfo();

  return (
    <>
      <main className=" bg-amber-50">
        <Hero pageInfo={pageInfo}></Hero>
        <div className="flex flex-col">
          <SortSelector className=" self-end mr-10" />
          <ProductsGrid products={products} strapiHost={STRAPI_HOST} />
          <GridPagination />
        </div>
      </main>
    </>
  );
}
