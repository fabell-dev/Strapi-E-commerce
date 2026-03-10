import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";
import { Product, ProductGridItem } from "@/types/product.types";

//--------- Función para obtener Categorias
export const fetchCategories = unstable_cache(
  async () => {
    return queryRead("product-categories").then((res) => {
      return res.data.map((item: any) => item.name);
    });
  },
  ["categories"],
  { revalidate: 3600 },
);

//--------- Función para obtener productos (Devuelve todos,exepto si se le pasa una categoria que solo dvuelve los de esa categoria)
export const fetchProducts = unstable_cache(
  async (categoryName?: string): Promise<ProductGridItem[]> => {
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
          fields: ["color", "stock"],
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
    });

    return queryRead(`products?${queryOptions}`).then((res) => {
      return res.data;
    });
  },
  ["products"],
  { revalidate: 60 },
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
        fields: ["color", "stock"],
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
