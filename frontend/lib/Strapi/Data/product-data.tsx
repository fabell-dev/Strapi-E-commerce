import { unstable_cache } from "next/cache";
import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";

//---------Categrorias
export const fetchCategrories = unstable_cache(
  async () => {
    return queryRead("product-categories").then((res) => {
      const { Page_Title, Page_Description, Page_Logo } = res.data;
      return res.data;
    });
  },
  ["categories"],
  { revalidate: 60 },
);

//--------- Función para obtener categorias
export async function getProductCategories() {
  const data = await fetchCategrories();
  const categories = data.map((item: any) => item.name);

  return categories;
}

//--------- Función para obtener productos
export const fetchAllProducts = unstable_cache(
  async () => {
    const queryProducts = qs.stringify({
      fields: ["name", "price", "stock", "color"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
        variants: {
          fields: ["color"],
          populate: {
            image: {
              fields: ["url", "name"],
            },
          },
        },
      },
    });
    return queryRead(`products?${queryProducts}`).then((res) => {
      return res.data;
    });
  },
  ["product"],
  { revalidate: 60 },
);

//--------- Función para obtener productos filtrados por categoría
export const fetchProductsByCategory = unstable_cache(
  async (categoryName: string) => {
    const queryProductsByCategory = qs.stringify({
      filters: {
        subCategory: {
          category: {
            name: {
              $eq: categoryName,
            },
          },
        },
      },
      fields: ["name", "price", "stock", "color"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
        variants: {
          fields: ["color"],
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
      },
    });

    return queryRead(`products?${queryProductsByCategory}`).then((res) => {
      return res.data;
    });
  },
  ["productsByCategory"],
  { revalidate: 60 },
);

export async function getProductsByCategory(categoryName: string) {
  const products = await fetchProductsByCategory(categoryName);
  return products;
}
