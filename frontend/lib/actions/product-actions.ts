"use server";

import {
  fetchProducts,
  fetchProductBySlug,
} from "@/lib/Strapi/Data/product-data";
import { ProductGridItem, Product } from "@/types/product.types";

export async function getProductsByCategory(
  categoryName: string,
): Promise<ProductGridItem[]> {
  try {
    const products = await fetchProducts(categoryName);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getProductBySlugg(slug: string): Promise<Product | null> {
  try {
    const product = await fetchProductBySlug(slug);
    return product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<ProductGridItem[]> {
  try {
    const products = await fetchProducts();
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function searchProducts(
  query: string,
  category?: string,
  productSlug?: string,
): Promise<ProductGridItem[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const filters: any = {
      name: {
        $containsi: query,
      },
    };

    if (category) {
      filters.subCategory = {
        category: {
          name: {
            $eqi: category,
          },
        },
      };
    }

    // Si estamos en una página de producto, excluir ese producto de los resultados
    if (productSlug) {
      filters.slug = {
        $ne: productSlug,
      };
    }

    const qs = await import("qs");
    const queryString = qs.default.stringify({
      filters,
      fields: ["name", "slug", "price"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
      pagination: {
        limit: 8,
      },
    });

    const { queryRead } = await import("@/lib/Strapi/strapi");
    const response = await queryRead(`products?${queryString}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
