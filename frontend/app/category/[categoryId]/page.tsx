import {
  fetchCategories,
  fetchCategoriesDirect,
} from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";
import MainSection from "@/components/MainSection/MainSection";
import { redirect } from "next/navigation";
import { getImageUrl } from "@/lib/utils/image-url";

const STRAPI_HOST = process.env.STRAPI_HOST;

//Se generan los params depende de las categorias disponibles desde STRAPI
export async function generateStaticParams() {
  const categories = await fetchCategoriesDirect();

  if (!categories || categories.length === 0) {
    console.warn("[generateStaticParams] No categories returned");
    return [];
  }

  return categories.map(
    (category: { name: string; description: string; image: unknown }) => ({
      categoryId: category.name.toLowerCase().replace(/\s+/g, "-"),
    }),
  );
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
    redirect("?page=1&pageSize=9");
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
      <div className="relative h-64 md:h-80 overflow-hidden ">
        <img
          src={getImageUrl((currentCategory.image as any)?.url)}
          alt={currentCategory.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl mb-4">
                {currentCategory.name}
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                {currentCategory.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <MainSection
        searchParams={searchParams}
        category={currentCategory.name}
      />
    </>
  );
}
