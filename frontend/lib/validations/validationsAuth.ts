import { z } from "zod";

export const SigninFormSchema = z.object({
  identifier: z
    .string()
    .min(1, "Usuario o email requerido")
    .max(255, "El email o usuario es demasiado largo"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignupFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
    cpassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  });

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export type SignupFormState = {
  success?: boolean;
  message?: string | boolean;
  data?: {
    username?: string;
    email?: string;
    password?: string;
    cpassword?: string;
  };
  Errors?: {
    message?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
    cpassword?: string[];
  } | null;
};

//SignIn
export type SigninFormState = {
  success?: boolean;
  message?: string | boolean;
  data?: {
    identifier?: string;
    password?: string;
  };
  Errors?: {
    identifier?: string[];
    password?: string[];
  } | null;
};
