import { Review } from "./review-types";
// Interfaces para productos en Strapi

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

export interface ProductVariant {
  id: number;
  documentId?: string;
  color: string;
  stock: number;
  image: StrapiImage;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
}

export interface SubCategory {
  id: number;
  documentId: string;
  name: string;
  category: Category;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  color?: string;
  slug: string;
  description?: string;
  image: StrapiImage;
  variants?: ProductVariant[];
  subCategory?: SubCategory;
  reviews?: Review[];
}

// Para el grid de productos (datos simplificados)
export interface ProductGridItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  color?: string;
  slug: string;
  image: StrapiImage;
  variants?: ProductVariant[];
}

// Para props de componentes
export interface ProductsGridProps {
  products: ProductGridItem[];
  strapiHost?: string;
}

export interface ProductCardProps {
  product: ProductGridItem;
  strapiHost?: string;
}

export interface ProductPageProps {
  product: Product | null;
  strapiHost?: string;
}
