import {
  getProductCategories,
  getProductsByCategory,
} from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";

//Se generan los params depende de las categorias disponibles desde STRAPI
export async function generateStaticParams() {
  const categories = await getProductCategories();

  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/\s+/g, "-"),
  }));
}

//Se renderiza la pagina dinamicamente
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  //Se extrae la categoria desde los params
  const { category } = await params;
  //Se hace fetch de todas las categorias
  const categories = await getProductCategories();

  //Se busca la categoria actual comparandolas con todas las categorias disponibles
  const currentCategory = categories.find(
    (cat: string) => cat.toLowerCase().replace(/\s+/g, "-") === category,
  );

  if (!currentCategory) {
    notFound();
  }

  //Se le pasa la categoria actual a la funcion que ejecuta la query
  const products = await getProductsByCategory(currentCategory);

  return (
    <div className="container mx-auto pt-32 px-4">
      <h1 className="text-3xl font-bold mb-8">{currentCategory}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <div key={product.id} className="border rounded-lg p-4">
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-lg font-semibold">${product.price}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found in this category</p>
        )}
      </div>
    </div>
  );
}
