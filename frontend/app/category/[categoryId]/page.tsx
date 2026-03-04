import {
  getProductCategories,
  getProductsByCategory,
} from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import ProductsGrid from "@/components/ProductsGrid";
import { SortSelector } from "@/components/SortSelector";
import GridPagination from "@/components/GridPagination";

const { STRAPI_HOST } = process.env;

//Se generan los params depende de las categorias disponibles desde STRAPI
export async function generateStaticParams() {
  const categories = await getProductCategories();

  return categories.map((category: string) => ({
    categoryId: category.toLowerCase().replace(/\s+/g, "-"),
  }));
}

//Se renderiza la pagina dinamicamente
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  //Se extrae la categoria desde los params
  const { categoryId } = await params;
  //Se hace fetch de todas las categorias
  const categories = await getProductCategories();

  //Se busca la categoria actual comparandolas con todas las categorias disponibles
  const currentCategory = categories.find(
    (cat: string) => cat.toLowerCase().replace(/\s+/g, "-") === categoryId,
  );

  if (!currentCategory) {
    notFound();
  }

  //Se le pasa la categoria actual a la funcion que ejecuta la query
  const products = await getProductsByCategory(currentCategory);

  return (
    <>
      <div className="flex flex-col md:mx-40 mx-5 mt-40 md:mt-30 ">
        <SortSelector className=" self-center lg:self-end lg:mr-10 mb-5 " />
        <ProductsGrid products={products} strapiHost={STRAPI_HOST} />
        <GridPagination />
      </div>
    </>
  );
}
