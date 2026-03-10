import { Product } from "./product.types";

export interface Review {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  rating: number;
  author: string;
  email: string;
  product: Product;
}
