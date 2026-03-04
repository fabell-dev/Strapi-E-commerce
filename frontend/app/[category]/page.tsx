import {
  getProductCategories,
  getProductsByCategory,
} from "@/lib/Strapi/Data/product-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = await getProductCategories();

  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = await getProductCategories();

  const originalCategory = categories.find(
    (cat: string) => cat.toLowerCase().replace(/\s+/g, "-") === category,
  );

  if (!originalCategory) {
    notFound();
  }

  const products = await getProductsByCategory(originalCategory);

  return (
    <div className="container mx-auto pt-32 px-4">
      <h1 className="text-3xl font-bold mb-8">{originalCategory}</h1>
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
