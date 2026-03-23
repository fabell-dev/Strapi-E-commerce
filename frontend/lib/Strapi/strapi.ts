import { cookies } from "next/headers";
import { getAuthToken } from "../actions/get-auth-token";

// Usar STRAPI_HOST en servidor, NEXT_PUBLIC_STRAPI_URL en cliente
const STRAPI_HOST =
  typeof window === "undefined"
    ? process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_URL
    : process.env.NEXT_PUBLIC_STRAPI_URL;

const { STRAPI_READ_TOKEN, STRAPI_FULLACCESS_TOKEN } = process.env;

//Queries

export function queryRead(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_READ_TOKEN}` },
  }).then((res) => res.json());
}

//Query con el token del usuario
export async function queryAutenticatedUser(url: string) {
  const token = await getAuthToken();
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}

export function queryFullControl(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_FULLACCESS_TOKEN}` },
  }).then((res) => res.json());
}

//--------Autentication-------
export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return token;
}

export async function getCurrentUser() {
  try {
    const token = await getToken();

    if (!token) return null;

    const response = await fetch(`${STRAPI_HOST}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

//CREATE REVIEW
export async function createReview(reviewData: {
  title: string;
  description: string;
  rating: number;
  author: string;
  email: string;
  productId: number;
}) {
  const token = await getToken();

  if (!token) {
    throw new Error("No autorizado");
  }

  const response = await fetch(`${STRAPI_HOST}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        title: reviewData.title,
        description: reviewData.description,
        rating: reviewData.rating,
        author: reviewData.author,
        email: reviewData.email,
        product: reviewData.productId,
        publishedAt: new Date().toISOString(), // Publicar automáticamente
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Error creando review");
  }

  return await response.json();
}
