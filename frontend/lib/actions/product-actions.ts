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
