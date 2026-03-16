"use server";

import {
  SignupFormSchema,
  type SignupFormState,
} from "../validations/validationsAuth";
import {
  SigninFormSchema,
  type SigninFormState,
} from "../validations/validationsAuth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const { STRAPI_HOST } = process.env;

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  return { success: true };
}

export async function registerUserAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const fields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    cpassword: formData.get("cpassword") as string,
  };
  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: undefined,
      data: fields,
      Errors: {
        username: flattenedErrors.fieldErrors.username,
        email: flattenedErrors.fieldErrors.email,
        password: flattenedErrors.fieldErrors.password,
        cpassword: flattenedErrors.fieldErrors.cpassword,
      },
    };
  } else {
    const response = await fetch(`${STRAPI_HOST}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: fields.username,
        email: fields.email,
        password: fields.password,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      const errorMessage = data.error?.message || "Error al registrar";

      // Mapear errores de Strapi a campos específicos
      const errors: {
        username?: string[];
        email?: string[];
        password?: string[];
        cpassword?: string[];
      } = {};

      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("taken")
      ) {
        errors.email = [errorMessage];
      } else if (
        errorMessage.toLowerCase().includes("username") ||
        errorMessage.toLowerCase().includes("username")
      ) {
        errors.username = [errorMessage];
      } else {
        errors.email = [errorMessage];
      }

      return {
        success: false,
        message: errorMessage,
        data: fields,
        Errors: errors,
      };
    }

    const data = await response.json();

    // Guardar el JWT en las cookies
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    redirect("/");
  }
}

export async function loginUserAction(
  prevState: SigninFormState,
  formData: FormData,
): Promise<SigninFormState> {
  const fields = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = SigninFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: undefined,
      data: fields,
      Errors: {
        identifier: flattenedErrors.fieldErrors.identifier,
        password: flattenedErrors.fieldErrors.password,
      },
    };
  }

  const response = await fetch(`${STRAPI_HOST}/api/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: fields.identifier,
      password: fields.password,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    const errorMessage = data.error?.message || "Credenciales inválidas";

    return {
      success: false,
      message: errorMessage,
      data: fields,
      Errors: {
        identifier: [errorMessage],
      },
    };
  }

  const data = await response.json();

  // Guardar el JWT en las cookies
  const cookieStore = await cookies();
  cookieStore.set("authToken", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect("/");
}
