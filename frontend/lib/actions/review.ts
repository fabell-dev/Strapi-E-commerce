"use server";
import { z } from "zod";
import {
  ReviewFormState,
  ReviewSchema,
} from "../validations/validationsReview";
import { createReview } from "../Strapi/strapi";
import { getCurrentUser } from "@/lib/Strapi/strapi";
import { LucideFileSliders } from "lucide-react";

export async function sendReviewAction(
  prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      message: "Debes estar autenticado para crear una review",
      Errors: null,
    };
  }
  const fields = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    author: currentUser.username as string,
    email: currentUser.email as string,
    rating: Number(formData.get("rating")),
    productId: Number(formData.get("productId")),
  };

  const validatedFields = ReviewSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: undefined,
      data: fields,
      Errors: {
        title: flattenedErrors.fieldErrors.title,
        description: flattenedErrors.fieldErrors.description,
        author: flattenedErrors.fieldErrors.author,
        email: flattenedErrors.fieldErrors.email,
        rating: flattenedErrors.fieldErrors.rating,
        productId: flattenedErrors.fieldErrors.productId,
      },
    };
  } else {
    try {
      const response = await createReview(fields);
      return {
        success: true,
        message: "Review succesfully created",
        data: fields,
        Errors: null,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear la review",
        data: fields,
        Errors: null,
      };
    }
  }
}
