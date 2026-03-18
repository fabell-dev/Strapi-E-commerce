import { cookies } from "next/headers";

// En servidor (SSR), usar localhost; en cliente, usar la IP
const STRAPI_HOST =
  typeof window === "undefined"
    ? "http://localhost:1337" // Server-side
    : process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const { STRAPI_READ_TOKEN, STRAPI_FULLACCESS_TOKEN } = process.env;

//Queries

export function queryRead(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_READ_TOKEN}` },
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
