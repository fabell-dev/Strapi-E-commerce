import { cookies } from "next/headers";

const { STRAPI_HOST, STRAPI_READ_TOKEN, STRAPI_FULLACCESS_TOKEN } = process.env;

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
  const token = await getToken();

  if (!token) return null;

  const response = await fetch(`${STRAPI_HOST}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  return await response.json();
}

//Asi debe ser la estructura de las peticiones
export async function autenticatedRequest(url: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("No autorizado");
  }

  const response = await fetch(`${STRAPI_HOST}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.json();
}

// export async function isAutenticated() {
//   const token = await getToken();
//   return !!token;
// }
