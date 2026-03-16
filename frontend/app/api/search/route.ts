import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const currentProductSlug = searchParams.get("slug");

  if (!query || query.trim().length < 2) {
    return Response.json([]);
  }

  try {
    const filters: Record<string, unknown> = {
      name: {
        $containsi: query,
      },
    };

    // Si se proporciona una categoría, filtrar solo por esa categoría
    if (category) {
      filters.subCategory = {
        category: {
          name: {
            $eqi: category,
          },
        },
      };
    }

    // Si estamos en una página de producto, excluir ese producto de los resultados
    if (currentProductSlug) {
      filters.slug = {
        $ne: currentProductSlug,
      };
    }

    const queryString = qs.stringify({
      filters,
      fields: ["name", "slug", "price"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
      pagination: {
        limit: 8,
      },
    });

    const response = await queryRead(`products?${queryString}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return Response.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json([]);
  }
}
