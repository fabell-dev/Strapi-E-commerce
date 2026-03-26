import {
  fetchCategories,
  fetchCategoriesDirect,
} from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import MainSection from "@/components/MainSection/MainSection";
import CategoryBanner from "@/components/CategoryBanner";
import { redirect } from "next/navigation";

const STRAPI_HOST = process.env.STRAPI_HOST;

// Estrategia: ISR (Incremental Static Regeneration)
// - dynamicParams=true permite generar rutas on-demand si no existen
// - revalidate=3600 regenera cada 1 hora
export const dynamicParams = true;
export const revalidate = 3600;

//Se generan los params depende de las categorias disponibles desde STRAPI
export async function generateStaticParams() {
  try {
    const categories = await fetchCategoriesDirect();

    if (!categories || categories.length === 0) {
      console.warn(
        "[generateStaticParams] No categories returned. Build will proceed with ISR on-demand generation.",
      );
      return [];
    }

    return categories.map(
      (category: { name: string; description: string; image: unknown }) => ({
        categoryId: category.name.toLowerCase().replace(/\s+/g, "-"),
      }),
    );
  } catch (error) {
    console.warn(
      "[generateStaticParams] Error fetching categories from Strapi. ISR will generate routes on-demand:",
      error instanceof Error ? error.message : error,
    );
    // Retornar array vacío permite que ISR genere rutas cuando se visiten
    return [];
  }
}

//Se renderiza la pagina dinamicamente
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const paramsPagination = await searchParams;

  if (!paramsPagination.page || !paramsPagination.pageSize) {
    redirect("?page=1&pageSize=8");
  }

  const { categoryId } = await params;
  const paramData = await searchParams;

  const categories = await fetchCategories();

  const currentCategory = categories.find(
    (cat: { name: string; description: string; image: unknown }) =>
      cat.name.toLowerCase().replace(/\s+/g, "-") === categoryId,
  );

  if (!currentCategory) {
    notFound();
  }

  return (
    <>
      <div className="pt-50 md:pt-20"></div>
      <CategoryBanner
        image={(currentCategory.image as any)?.url}
        name={currentCategory.name}
        description={currentCategory.description}
      />
      <MainSection
        searchParams={searchParams}
        category={currentCategory.name}
      />
    </>
  );
}
