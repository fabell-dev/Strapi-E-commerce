import { fetchCategories, fetchProducts } from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import { MainSectionClient } from "@/components/layout/MainSection/MainSectionClient";
import { redirect } from "next/navigation";

const STRAPI_HOST = process.env.STRAPI_HOST;

//Se generan los params depende de las categorias disponibles desde STRAPI
export async function generateStaticParams() {
  const categories = await fetchCategories();

  return categories.map((category: string) => ({
    categoryId: category.toLowerCase().replace(/\s+/g, "-"),
  }));
}

//Se renderiza la pagina dinamicamente
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: any;
}) {
  const paramsPagination = await searchParams;

  if (!paramsPagination.page || !paramsPagination.pageSize) {
    redirect("?page=1&pageSize=9");
  }

  //Se extrae la categoria desde los params
  const { categoryId } = await params;
  const paramData = await searchParams;
  const page = parseInt(paramData.page || "1");
  const pageSize = parseInt(paramData.pageSize || "12");

  //Se hace fetch de todas las categorias
  const categories = await fetchCategories();

  //Se busca la categoria actual comparandolas con todas las categorias disponibles
  const currentCategory = categories.find(
    (cat: string) => cat.toLowerCase().replace(/\s+/g, "-") === categoryId,
  );

  if (!currentCategory) {
    notFound();
  }

  //Se le pasa la categoria actual a la funcion que ejecuta la query
  const { data: productsByCategory, pagination } = await fetchProducts(
    page,
    pageSize,
    currentCategory,
  );

  return (
    <MainSectionClient
      pagination={pagination}
      products={productsByCategory}
      strapiHost={STRAPI_HOST}
    />
  );
}
