import { unstable_cache } from "next/cache";
import { cache } from "react";
import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";
import { Product, FetchProductsResult } from "@/types/product.types";

//--------- Función directa para obtener Categorias (sin caché, para generateStaticParams)
export async function fetchCategoriesDirect() {
  try {
    const queryOptions = qs.stringify({
      fields: ["name", "description"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
    });

    const res = await queryRead(`product-categories?${queryOptions}`);

    if (!res.data || !Array.isArray(res.data)) {
      console.warn(
        "[fetchCategoriesDirect] No categories data or invalid format from Strapi",
        res,
      );
      return [];
    }

    return res.data.map((item: Record<string, unknown>) => ({
      name: item.name,
      description: item.description,
      image: item.image,
    }));
  } catch (error) {
    console.error("[fetchCategoriesDirect] Error fetching categories:", error);
    return [];
  }
}

//--------- Función para obtener Categorias
export const fetchCategories = unstable_cache(
  async () => {
    return await fetchCategoriesDirect();
  },
  ["categories"],
  { revalidate: 3600 },
);

//--------- Función para obtener productos (Devuelve todos,exepto si se le pasa una categoria que solo dvuelve los de esa categoria)
export const fetchProducts = cache(
  async (
    page?: number,
    pageSize?: number,
    categoryName?: string,
  ): Promise<FetchProductsResult> => {
    try {
      const filters = categoryName
        ? {
            subCategory: {
              category: {
                name: {
                  $eq: categoryName,
                },
              },
            },
          }
        : {};

      const queryOptions = qs.stringify({
        filters,
        fields: ["name", "price", "stock", "color", "slug"],
        populate: {
          image: {
            fields: ["url", "name"],
          },
          variants: {
            fields: ["id", "color", "stock"],
            populate: {
              image: {
                fields: ["url", "name"],
              },
            },
          },
          ...(categoryName && {
            subCategory: {
              populate: {
                category: {
                  fields: ["name"],
                },
              },
            },
          }),
        },
        pagination: {
          page: page || 1,
          pageSize: pageSize || 25,
        },
      });

      const res = await queryRead(`products?${queryOptions}`);

      if (!res.data || !Array.isArray(res.data)) {
        console.warn("[fetchProducts] No products data or invalid format");
        return {
          data: [],
          pagination: { page: 1, pageCount: 0, pageSize: 25, total: 0 },
        };
      }

      return {
        data: res.data,
        pagination: res.meta?.pagination || {
          page: page || 1,
          pageCount: 0,
          pageSize: pageSize || 25,
          total: 0,
        },
      };
    } catch (error) {
      console.error("[fetchProducts] Error fetching products:", error);
      return {
        data: [],
        pagination: { page: 1, pageCount: 0, pageSize: 25, total: 0 },
      };
    }
  },
);

//--------- Función para obtener un producto por slug
export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const queryOptions = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    fields: ["name", "price", "stock", "color", "slug", "description"],
    populate: {
      image: {
        fields: ["url", "name"],
      },
      variants: {
        fields: ["id", "color", "stock"],
        populate: {
          image: {
            fields: ["url", "name"],
          },
        },
      },
      subCategory: {
        populate: {
          category: {
            fields: ["name"],
          },
        },
      },
      reviews: {
        fields: [
          "author",
          "email",
          "title",
          "description",
          "rating",
          "createdAt",
        ],
      },
    },
  });

  return queryRead(`products?${queryOptions}`).then((res) => {
    return res.data?.[0] || null;
  });
};
