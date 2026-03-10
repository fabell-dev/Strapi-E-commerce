"use server";
import { z } from "zod";
import {
  ReviewFormState,
  ReviewSchema,
} from "../validations/validationsReview";
import { createReview } from "../Strapi/strapi";
import { getCurrentUser } from "@/lib/Strapi/strapi";

export async function sendReviewAction(
  prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const fields = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    author: formData.get("author") as string,
    email: formData.get("email") as string,
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
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "Debes estar autenticado para crear una review",
          data: fields,
          Errors: null,
        };
      }
      const reviewData = {
        ...fields,
        author: currentUser.username,
        email: currentUser.email,
      };
      const response = await createReview(reviewData);
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
