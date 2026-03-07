import { fetchCategories, fetchProducts } from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import { MainSectionClient } from "@/components/MainSectionClient";

const { STRAPI_HOST } = process.env;

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
}: {
  params: Promise<{ categoryId: string }>;
}) {
  //Se extrae la categoria desde los params
  const { categoryId } = await params;
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
  const productsByCategory = await fetchProducts(currentCategory);

  return (
    <MainSectionClient products={productsByCategory} strapiHost={STRAPI_HOST} />
  );
}
