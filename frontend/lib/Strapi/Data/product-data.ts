import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";
import { Product, FetchProductsResult } from "@/types/product.types";

//--------- Función para obtener Categorias
export const fetchCategories = unstable_cache(
  async () => {
    const queryOptions = qs.stringify({
      fields: ["name", "description"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
    });

    return queryRead(`product-categories?${queryOptions}`).then((res) => {
      return res.data.map((item: Record<string, unknown>) => ({
        name: item.name,
        description: item.description,
        image: item.image,
      }));
    });
  },
  ["categories"],
  { revalidate: 3600 },
);

//--------- Función para obtener productos (Devuelve todos,exepto si se le pasa una categoria que solo dvuelve los de esa categoria)
export const fetchProducts = unstable_cache(
  async (
    page?: number,
    pageSize?: number,
    categoryName?: string,
  ): Promise<FetchProductsResult> => {
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

    return queryRead(`products?${queryOptions}`).then((res) => {
      return {
        data: res.data,
        pagination: res.meta.pagination,
      };
    });
  },
  ["products"],
  { revalidate: 120 }, // Revalidar cada 2 minutos
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
