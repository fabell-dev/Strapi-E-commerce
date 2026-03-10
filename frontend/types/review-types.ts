import { Product } from "./product.types";

export interface Review {
  length: number;
  id: number;
  documentId?: string;
  title: string;
  description: string;
  rating: number;
  author: string;
  email: string;
  product: Product;
  createdAt: string;
}
