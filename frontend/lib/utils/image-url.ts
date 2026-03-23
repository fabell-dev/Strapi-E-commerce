/**
 * Construye una URL completa de imagen
 * Maneja tanto URLs absolutas como relativas
 */
export function getImageUrl(
  imageUrl: string | undefined,
  strapiHost?: string
): string {
  if (!imageUrl) return "";

  // Si ya es una URL absoluta, retornarla tal cual
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Si es relativa, concatenar con STRAPI_HOST
  const host =
    strapiHost ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

  return `${host}${imageUrl}`;
}
