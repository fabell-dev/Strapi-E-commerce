import { z } from "zod";

export const ReviewSchema = z.object({
  productId: z.number().positive("Product ID es requerido"), // ← Agregar esto
  title: z
    .string()
    .min(1, "Title is to short")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is to short")
    .max(500, "Description must be less than 100 characters"),
  author: z
    .string()
    .min(3, "Author must be at least 6 characters")
    .max(20, "Author must be less than 20 characters"),
  email: z.email("Please enter a valid email address"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be less than 5 "),
});

export type ReviewFormState = {
  loading?: boolean;
  success?: boolean;
  message?: string | null;
  data?: {
    title: string;
    description: string;
    author: string;
    email: string;
    rating: number;
  };
  Errors?: {
    productId?: string[];
    message?: string[];
    title?: string[];
    description?: string[];
    author?: string[];
    email?: string[];
    rating?: string[];
  } | null;
};
